import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { CreateNotificationInput } from './dto/create-notification.input';
import {
  NotificationTable,
  UsersToNotificationsTable,
} from '../drizzle/schema/schema';
import {
  AuthUserHasNoPermissonException,
  CreateNotificationException,
  CreateUsersToNotificationException,
  NotificationNotFoundException,
} from '../exceptions';
import {
  Notification,
  PaginatedNotifications,
} from './models/notification.model';
import { and, count, desc, eq, gt, inArray } from 'drizzle-orm';
import {
  GetNotificationInput,
  GetNotificationsInput,
} from './dto/get-notification.input';
import { DefaultAfterValueForSearch } from '../constants';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { DeleteNotificationInput } from './dto/delete-notification.input';

@Injectable()
export class NotificationService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /* ============================== Create Operations ============================== */
  async createNotification(
    input: CreateNotificationInput,
  ): Promise<Notification> {
    return this.db.transaction(async (tx) => {
      const responseOfCreateNotification = (await tx
        .insert(NotificationTable)
        .values({
          title: input.title,
          content: input.content,
          type: input.type,
          linkId: input.linkId,
        })
        .returning()) as Notification[] | undefined;
      if (
        !responseOfCreateNotification ||
        responseOfCreateNotification.length === 0
      ) {
        throw CreateNotificationException;
      }

      const responseOfCreateUsersToNotifications = await tx
        .insert(UsersToNotificationsTable)
        .values(
          input.to.map((id) => ({
            userId: id,
            notificationId: responseOfCreateNotification[0].id,
          })),
        )
        .returning();
      if (
        !responseOfCreateUsersToNotifications ||
        responseOfCreateUsersToNotifications.length === 0
      ) {
        throw CreateUsersToNotificationException;
      }

      return responseOfCreateNotification[0];
    });
  }
  /* ============================== Create Operations ============================== */

  /* ============================== Get Operations ============================== */
  async getMyNotification(
    userId: string,
    input: GetNotificationInput,
  ): Promise<Notification> {
    const response = (await this.db
      .select({
        ownerId: UsersToNotificationsTable.userId,
        id: NotificationTable.id,
        title: NotificationTable.title,
        content: NotificationTable.content,
        type: NotificationTable.type,
        linkId: NotificationTable.linkId,
        isRead: NotificationTable.isRead,
        updatedAt: NotificationTable.updatedAt,
        createdAt: NotificationTable.createdAt,
      })
      .from(NotificationTable)
      .where(eq(NotificationTable.id, input.notificationId))
      .leftJoin(
        UsersToNotificationsTable,
        eq(UsersToNotificationsTable.notificationId, NotificationTable.id),
      )) as (Notification & { ownerId: string })[] | undefined;
    if (!response || response.length === 0) {
      throw NotificationNotFoundException;
    }

    if (response[0].ownerId !== userId) {
      throw AuthUserHasNoPermissonException;
    }

    return {
      id: response[0].id,
      title: response[0].title,
      content: response[0].content,
      type: response[0].type,
      linkId: response[0].linkId,
      isRead: response[0].isRead,
      updatedAt: response[0].updatedAt,
      createdAt: response[0].createdAt,
    };
  }

  async getMyNotifications(
    userId: string,
    input: GetNotificationsInput,
  ): Promise<PaginatedNotifications> {
    const response = (await this.db
      .select({
        id: NotificationTable.id,
        title: NotificationTable.title,
        content: NotificationTable.content,
        type: NotificationTable.type,
        linkId: NotificationTable.linkId,
        isRead: NotificationTable.isRead,
        updatedAt: NotificationTable.updatedAt,
        createdAt: NotificationTable.createdAt,
      })
      .from(UsersToNotificationsTable)
      .where(
        and(
          eq(UsersToNotificationsTable.userId, userId),
          gt(NotificationTable.id, input.after),
        ),
      )
      .leftJoin(
        NotificationTable,
        eq(UsersToNotificationsTable.notificationId, NotificationTable.id),
      )
      .orderBy(desc(NotificationTable.updatedAt))
      .limit(input.first + 1)) as Notification[] | undefined;
    if (!response || response.length === 0) {
      throw NotificationNotFoundException;
    }

    if (!input.totCount) {
      const [{ totalCount }] = await this.db
        .select({
          totalCount: count(),
        })
        .from(NotificationTable)
        .where(
          and(
            eq(UsersToNotificationsTable.userId, userId),
            gt(NotificationTable.id, input.after),
          ),
        );
      input.totCount = totalCount;
    }

    const hasNextPage: boolean = response.length > input.first;
    const hasPrevPage: boolean = input.after !== DefaultAfterValueForSearch;
    if (response.length > input.first) response.pop();

    return {
      edges: response.map((notification) => ({
        cursor: notification.id,
        node: {
          id: notification.id,
          title: notification.title,
          content: notification.content,
          type: notification.type,
          linkId: notification.linkId,
          isRead: notification.isRead,
          updatedAt: notification.updatedAt,
          createdAt: notification.createdAt,
        },
      })),
      totalCount: input.totCount,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
    };
  }
  /* ============================== Get Operations ============================== */

  /* ============================== Update Operations ============================== */
  async updateMyNotification(
    userId: string,
    input: UpdateNotificationInput,
  ): Promise<Notification> {
    return this.db.transaction(async (tx) => {
      const responseOfSelectingUsersToNotification = await tx
        .select({
          userId: UsersToNotificationsTable.userId,
          notificationIda: UsersToNotificationsTable.notificationId,
        })
        .from(UsersToNotificationsTable)
        .where(
          and(
            eq(UsersToNotificationsTable.notificationId, input.notificationId),
            eq(UsersToNotificationsTable.userId, userId),
          ),
        );
      if (
        !responseOfSelectingUsersToNotification ||
        responseOfSelectingUsersToNotification.length === 0
      ) {
        throw NotificationNotFoundException;
      }

      const responseOfSelectingNotification = (await tx
        .update(NotificationTable)
        .set({
          isRead: true,
        })
        .where(eq(NotificationTable.id, input.notificationId))
        .returning({
          id: NotificationTable.id,
          title: NotificationTable.title,
          content: NotificationTable.content,
          type: NotificationTable.type,
          isRead: NotificationTable.isRead,
          updatedAt: NotificationTable.updatedAt,
        })) as Notification[] | undefined;
      if (
        !responseOfSelectingNotification ||
        responseOfSelectingNotification.length === 0
      ) {
        throw NotificationNotFoundException;
      }

      return responseOfSelectingNotification[0];
    });
  }
  /* ============================== Update Operations ============================== */

  /* ============================== Delete Operations ============================== */
  async deleteMyNotifications(userId: string, input: DeleteNotificationInput) {
    return await this.db
      .delete(UsersToNotificationsTable)
      .where(
        and(
          eq(UsersToNotificationsTable.userId, userId),
          inArray(
            UsersToNotificationsTable.notificationId,
            input.notificationIds,
          ),
        ),
      );
  }
  /* ============================== Delete Operations ============================== */
}
