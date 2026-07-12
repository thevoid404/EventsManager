import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        message: true,
        read: true,
        relatedId: true,
        createdAt: true,
      },
    });

    return notifications;
  }

  async markRead(notificationId: string, user: AuthenticatedUser) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID "${notificationId}" not found`,
      );
    }

    if (notification.userId !== user.id) {
      throw new ForbiddenException(
        'You can only mark your own notifications as read',
      );
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
      select: {
        id: true,
        type: true,
        message: true,
        read: true,
        relatedId: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async markAllRead(user: AuthenticatedUser) {
    await this.prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });

    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(user: AuthenticatedUser) {
    const count = await this.prisma.notification.count({
      where: { userId: user.id, read: false },
    });

    return { count };
  }

  /**
   * Internal helper used by other services to create notifications.
   */
  async createNotification(params: {
    userId: string;
    type: NotificationType;
    message: string;
    relatedId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        message: params.message,
        relatedId: params.relatedId,
      },
    });
  }
}
