import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsQueryDto } from './dto/events-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Select shape returned for event lists
const eventListSelect = {
  id: true,
  title: true,
  category: true,
  eventType: true,
  description: true,
  registrationDeadline: true,
  eventDate: true,
  registrationLink: true,
  bannerImage: true,
  createdAt: true,
  createdBy: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
  _count: { select: { interests: true, teams: true } },
} satisfies Prisma.EventSelect;

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findAll(
    query: EventsQueryDto,
    user: AuthenticatedUser | null,
  ): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      eventType,
      sortBy = 'createdAt',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.EventWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (eventType) {
      where.eventType = eventType;
    }

    // Map sortBy to Prisma orderBy
    const orderByMap: Record<string, Prisma.EventOrderByWithRelationInput> = {
      deadline: { registrationDeadline: 'asc' },
      eventDate: { eventDate: 'asc' },
      createdAt: { createdAt: 'desc' },
    };
    const orderBy = orderByMap[sortBy] ?? { createdAt: 'desc' };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        select: eventListSelect,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    // Attach isInterested flag if user is authenticated
    let interestedEventIds = new Set<string>();
    if (user) {
      const interests = await this.prisma.eventInterest.findMany({
        where: {
          userId: user.id,
          eventId: { in: events.map((e) => e.id) },
        },
        select: { eventId: true },
      });
      interestedEventIds = new Set(interests.map((i) => i.eventId));
    }

    const data = events.map((event) => ({
      ...event,
      isInterested: user ? interestedEventIds.has(event.id) : null,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: AuthenticatedUser | null) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: {
        ...eventListSelect,
        teams: {
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
            leader: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
            _count: { select: { members: true } },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    let isInterested: boolean | null = null;
    if (user) {
      const interest = await this.prisma.eventInterest.findUnique({
        where: { eventId_userId: { eventId: id, userId: user.id } },
      });
      isInterested = !!interest;
    }

    return { ...event, isInterested };
  }

  async create(
    dto: CreateEventDto,
    user: AuthenticatedUser,
    bannerImage?: Express.Multer.File,
  ) {
    let bannerImageUrl: string | undefined;

    if (bannerImage) {
      const result = await this.cloudinary.uploadImage(
        bannerImage,
        'seu-events/banners',
      );
      bannerImageUrl = result.secure_url;
    }

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        category: dto.category,
        eventType: dto.eventType,
        description: dto.description,
        registrationDeadline: new Date(dto.registrationDeadline),
        eventDate: new Date(dto.eventDate),
        registrationLink: dto.registrationLink,
        bannerImage: bannerImageUrl,
        createdById: user.id,
      },
      select: eventListSelect,
    });

    return event;
  }

  async update(
    id: string,
    dto: UpdateEventDto,
    user: AuthenticatedUser,
    bannerImage?: Express.Multer.File,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: { id: true, createdById: true, bannerImage: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    if (event.createdById !== user.id) {
      throw new ForbiddenException('You can only update your own events');
    }

    let bannerImageUrl = event.bannerImage ?? undefined;

    if (bannerImage) {
      // Delete old image from Cloudinary if it exists
      if (event.bannerImage) {
        try {
          const publicId = this.extractCloudinaryPublicId(event.bannerImage);
          if (publicId) await this.cloudinary.deleteImage(publicId);
        } catch {
          // Non-blocking: log would go here in production
        }
      }

      const result = await this.cloudinary.uploadImage(
        bannerImage,
        'seu-events/banners',
      );
      bannerImageUrl = result.secure_url;
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.category && { category: dto.category }),
        ...(dto.eventType && { eventType: dto.eventType }),
        ...(dto.description && { description: dto.description }),
        ...(dto.registrationDeadline && {
          registrationDeadline: new Date(dto.registrationDeadline),
        }),
        ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
        ...(dto.registrationLink !== undefined && {
          registrationLink: dto.registrationLink,
        }),
        bannerImage: bannerImageUrl,
      },
      select: eventListSelect,
    });

    return updated;
  }

  async remove(id: string, user: AuthenticatedUser) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: { id: true, createdById: true, bannerImage: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    if (event.createdById !== user.id) {
      throw new ForbiddenException('You can only delete your own events');
    }

    // Delete banner from Cloudinary (non-blocking)
    if (event.bannerImage) {
      try {
        const publicId = this.extractCloudinaryPublicId(event.bannerImage);
        if (publicId) await this.cloudinary.deleteImage(publicId);
      } catch {
        // Non-blocking
      }
    }

    await this.prisma.event.delete({ where: { id } });

    return { message: 'Event deleted successfully' };
  }

  /**
   * Extracts the public_id from a Cloudinary secure_url.
   * Example: https://res.cloudinary.com/demo/image/upload/v1234/seu-events/banners/abc.jpg
   * → seu-events/banners/abc
   */
  private extractCloudinaryPublicId(url: string): string | null {
    try {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}
