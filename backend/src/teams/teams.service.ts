import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { CreateTeamDto } from './dto/create-team.dto';

const teamDetailSelect = {
  id: true,
  name: true,
  maxMembers: true,
  lookingFor: true,
  description: true,
  whatsapp: true,
  facebook: true,
  discord: true,
  createdAt: true,
  eventId: true,
  leader: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
  members: {
    select: {
      id: true,
      isLeader: true,
      joinedAt: true,
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true, department: true },
      },
    },
    orderBy: { joinedAt: 'asc' as const },
  },
  _count: { select: { members: true } },
};

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findByEvent(eventId: string, user?: AuthenticatedUser) {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }

    const teams = await this.prisma.team.findMany({
      where: { eventId },
      select: {
        id: true,
        name: true,
        maxMembers: true,
        lookingFor: true,
        description: true,
        whatsapp: true,
        facebook: true,
        discord: true,
        createdAt: true,
        leaderId: true,
        leader: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Attach membership flags if user is authenticated
    if (user) {
      const memberships = await this.prisma.teamMember.findMany({
        where: {
          userId: user.id,
          teamId: { in: teams.map((t) => t.id) },
        },
        select: { teamId: true, isLeader: true },
      });
      const membershipMap = new Map(
        memberships.map((m) => [m.teamId, m.isLeader]),
      );

      return teams.map((team) => ({
        ...team,
        isMember: membershipMap.has(team.id),
        isLeader: membershipMap.get(team.id) === true,
        isMyTeam: team.leaderId === user.id,
      }));
    }

    return teams.map((team) => ({
      ...team,
      isMember: null,
      isLeader: null,
      isMyTeam: null,
    }));
  }

  async findOne(teamId: string, user?: AuthenticatedUser) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: teamDetailSelect,
    });

    if (!team) {
      throw new NotFoundException(`Team with ID "${teamId}" not found`);
    }

    let isMember = false;
    let isLeader = false;
    let pendingRequest: { id: string; status: string } | null = null;

    if (user) {
      const membership = await this.prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId, userId: user.id } },
        select: { isLeader: true },
      });
      isMember = !!membership;
      isLeader = membership?.isLeader ?? false;

      if (!isMember) {
        const request = await this.prisma.joinRequest.findFirst({
          where: { teamId, userId: user.id, status: 'pending' },
          select: { id: true, status: true },
        });
        pendingRequest = request;
      }
    }

    return { ...team, isMember, isLeader, pendingRequest };
  }

  async create(eventId: string, dto: CreateTeamDto, user: AuthenticatedUser) {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }

    // Check if user already leads or is in a team for this event
    const existingMembership = await this.prisma.teamMember.findFirst({
      where: {
        userId: user.id,
        team: { eventId },
      },
    });

    if (existingMembership) {
      throw new ConflictException(
        'You are already a member of a team for this event',
      );
    }

    // Create team and add leader as first member in a transaction
    const team = await this.prisma.$transaction(
      async (tx) => {
        const newTeam = await tx.team.create({
          data: {
            eventId,
            name: dto.name,
            maxMembers: dto.maxMembers,
            lookingFor: dto.lookingFor,
            description: dto.description,
            leaderId: user.id,
            whatsapp: dto.whatsapp,
            facebook: dto.facebook,
            discord: dto.discord,
          },
        });

        // Add leader as the first team member
        await tx.teamMember.create({
          data: {
            teamId: newTeam.id,
            userId: user.id,
            isLeader: true,
          },
        });

        return newTeam;
      },
      { timeout: 15000, maxWait: 15000 },
    );

    // Return full team details
    return this.prisma.team.findUnique({
      where: { id: team.id },
      select: teamDetailSelect,
    });
  }

  async createJoinRequest(
    teamId: string,
    dto: CreateJoinRequestDto,
    user: AuthenticatedUser,
  ) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        leaderId: true,
        maxMembers: true,
        event: { select: { title: true } },
        _count: { select: { members: true } },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID "${teamId}" not found`);
    }

    // Check if team is full
    if (team._count.members >= team.maxMembers) {
      throw new BadRequestException('This team is already full');
    }

    // Check if user is already a member
    const existingMembership = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } },
    });

    if (existingMembership) {
      throw new ConflictException('You are already a member of this team');
    }

    // Check for existing pending request
    const existingRequest = await this.prisma.joinRequest.findFirst({
      where: { teamId, userId: user.id, status: 'pending' },
    });

    if (existingRequest) {
      throw new ConflictException(
        'You already have a pending join request for this team',
      );
    }

    // Create join request
    const joinRequest = await this.prisma.joinRequest.create({
      data: {
        teamId,
        userId: user.id,
        introduction: dto.introduction,
      },
      select: {
        id: true,
        teamId: true,
        userId: true,
        introduction: true,
        status: true,
        createdAt: true,
      },
    });

    // Notify team leader
    const leaderUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true },
    });

    await this.notificationsService.createNotification({
      userId: team.leaderId,
      type: 'request_received',
      message: `${leaderUser?.name ?? 'Someone'} wants to join your team "${team.name}" for "${team.event.title}"`,
      relatedId: team.id,
    });

    return joinRequest;
  }

  async getJoinRequests(teamId: string, user: AuthenticatedUser) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, leaderId: true },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID "${teamId}" not found`);
    }

    if (team.leaderId !== user.id) {
      throw new ForbiddenException(
        'Only the team leader can view join requests',
      );
    }

    const requests = await this.prisma.joinRequest.findMany({
      where: { teamId, status: 'pending' },
      select: {
        id: true,
        introduction: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return requests;
  }

  async acceptJoinRequest(
    teamId: string,
    requestId: string,
    user: AuthenticatedUser,
  ) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        leaderId: true,
        maxMembers: true,
        event: { select: { title: true } },
        _count: { select: { members: true } },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID "${teamId}" not found`);
    }

    if (team.leaderId !== user.id) {
      throw new ForbiddenException(
        'Only the team leader can accept join requests',
      );
    }

    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
      select: { id: true, teamId: true, userId: true, status: true },
    });

    if (!request || request.teamId !== teamId) {
      throw new NotFoundException(`Join request with ID "${requestId}" not found`);
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This join request has already been processed');
    }

    // Check capacity
    if (team._count.members >= team.maxMembers) {
      throw new BadRequestException(
        'Cannot accept: the team is already at maximum capacity',
      );
    }

    // Accept request and add member in a transaction
    await this.prisma.$transaction(
      async (tx) => {
        await tx.joinRequest.update({
          where: { id: requestId },
          data: { status: 'accepted' },
        });

        await tx.teamMember.create({
          data: {
            teamId,
            userId: request.userId,
            isLeader: false,
          },
        });

        // Reject all other pending requests from the same user in the same event
        // (optional cleanup - so they're not dangling)
      },
      { timeout: 15000, maxWait: 15000 },
    );

    // Notify the requester
    const leaderUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true },
    });

    await this.notificationsService.createNotification({
      userId: request.userId,
      type: 'request_accepted',
      message: `Your request to join team "${team.name}" for "${team.event.title}" has been accepted!`,
      relatedId: teamId,
    });

    // Notify all existing members that someone new joined
    const existingMembers = await this.prisma.teamMember.findMany({
      where: { teamId, userId: { not: request.userId } },
      select: { userId: true },
    });

    const newMember = await this.prisma.user.findUnique({
      where: { id: request.userId },
      select: { name: true },
    });

    await Promise.all(
      existingMembers.map((member) =>
        this.notificationsService.createNotification({
          userId: member.userId,
          type: 'member_joined',
          message: `${newMember?.name ?? 'A new member'} has joined your team "${team.name}"`,
          relatedId: teamId,
        }),
      ),
    );

    return { message: 'Join request accepted' };
  }

  async rejectJoinRequest(
    teamId: string,
    requestId: string,
    user: AuthenticatedUser,
  ) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        leaderId: true,
        event: { select: { title: true } },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID "${teamId}" not found`);
    }

    if (team.leaderId !== user.id) {
      throw new ForbiddenException(
        'Only the team leader can reject join requests',
      );
    }

    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
      select: { id: true, teamId: true, userId: true, status: true },
    });

    if (!request || request.teamId !== teamId) {
      throw new NotFoundException(`Join request with ID "${requestId}" not found`);
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This join request has already been processed');
    }

    await this.prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    // Notify the requester
    await this.notificationsService.createNotification({
      userId: request.userId,
      type: 'request_rejected',
      message: `Your request to join team "${team.name}" for "${team.event.title}" was not accepted this time.`,
      relatedId: teamId,
    });

    return { message: 'Join request rejected' };
  }
}
