import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Shared profile select shape
const profileSelect = {
  id: true,
  name: true,
  email: true,
  department: true,
  avatarUrl: true,
  createdAt: true,
  createdEvents: {
    select: {
      id: true,
      title: true,
      category: true,
      eventType: true,
      bannerImage: true,
      eventDate: true,
      registrationDeadline: true,
      createdAt: true,
      _count: { select: { interests: true, teams: true } },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  teamsLed: {
    select: {
      id: true,
      name: true,
      maxMembers: true,
      lookingFor: true,
      createdAt: true,
      event: {
        select: { id: true, title: true, category: true, eventDate: true },
      },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' as const },
  },
};

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(user: AuthenticatedUser) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: profileSelect,
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getProfileById(userId: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!profile) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return profile;
  }

  async updateProfile(user: AuthenticatedUser, dto: UpdateProfileDto) {
    // Build update data only from provided fields
    const data: {
      name?: string;
      department?: string;
      avatarUrl?: string | null;
    } = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.department !== undefined) data.department = dto.department;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return updated;
  }
}
