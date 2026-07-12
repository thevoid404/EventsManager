import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { MarkInterestedDto } from './dto/mark-interested.dto';

@Injectable()
export class InterestedService {
  constructor(private readonly prisma: PrismaService) {}

  async markInterested(
    eventId: string,
    dto: MarkInterestedDto,
    user: AuthenticatedUser,
  ) {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }

    // Upsert interest record (idempotent)
    const interest = await this.prisma.eventInterest.upsert({
      where: { eventId_userId: { eventId, userId: user.id } },
      create: {
        eventId,
        userId: user.id,
        interestText: dto.interestText ?? '',
      },
      update: {
        interestText: dto.interestText ?? '',
      },
      select: {
        id: true,
        eventId: true,
        userId: true,
        interestText: true,
        createdAt: true,
      },
    });

    return interest;
  }

  async removeInterest(eventId: string, user: AuthenticatedUser) {
    const interest = await this.prisma.eventInterest.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
    });

    if (!interest) {
      throw new NotFoundException('Interest record not found');
    }

    await this.prisma.eventInterest.delete({
      where: { eventId_userId: { eventId, userId: user.id } },
    });

    return { message: 'Interest removed successfully' };
  }

  async findByEvent(eventId: string) {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }

    const interests = await this.prisma.eventInterest.findMany({
      where: { eventId },
      select: {
        id: true,
        interestText: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return interests;
  }
}
