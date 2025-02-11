import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { CreateNotificationInput } from './dto/create-notification.input';
import {
  NotificationTable,
  UsersToNotificationsTable,
} from '../drizzle/schema/schema';
import {
  CreateNotificationException,
  CreateUsersToNotificationException,
  NotificationNotFoundException,
} from '../exceptions';
import {
  AffectedNotifications,
  Notification,
  PaginatedNotifications,
} from './models/notification.model';
import { and, count, desc, eq, gt, inArray, or } from 'drizzle-orm';
import {
  GetNotificationInput,
  GetNotificationsInput,
} from './dto/get-notification.input';
import { DefaultAfterValueForSearch } from '../constants';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { DeleteNotificationInput } from './dto/delete-notification.input';
import { NotificationGateway } from './notification.gateway';
import { AffectedCountModel } from '../models';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gateway: NotificationGateway,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  /* ============================== Create Operations ============================== */
  async createSomeByUserId(
    input: CreateNotificationInput,
  ): Promise<AffectedNotifications> {
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

      const notificationData = {
        id: responseOfCreateNotification[0].id,
        title: responseOfCreateNotification[0].title,
        content: responseOfCreateNotification[0].content,
        type: responseOfCreateNotification[0].type,
        linkId: responseOfCreateNotification[0].linkId,
        isRead: responseOfCreateNotification[0].isRead,
        updatedAt: responseOfCreateNotification[0].updatedAt,
        createdAt: responseOfCreateNotification[0].createdAt,
      } as Notification;
      let successCount = 0;
      for (const receiverId of input.to) {
        const response = this.gateway.notifyUser(receiverId, notificationData);
        successCount += response ? 1 : 0;
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

      return {
        notification: responseOfCreateNotification[0],
        totCount: input.to.length,
        successCount: successCount,
      };
    });
  }
  /* ============================== Create Operations ============================== */

  /* ============================== Get Operations ============================== */
  async getOneById(
    userId: string,
    input: GetNotificationInput,
  ): Promise<Notification> {
    const response = (await this.db
      .select({
        id: NotificationTable.id,
        title: NotificationTable.title,
        content: NotificationTable.content,
        type: NotificationTable.type,
        linkId: NotificationTable.linkId,
        isRead: UsersToNotificationsTable.isRead,
        updatedAt: NotificationTable.updatedAt,
        createdAt: NotificationTable.createdAt,
      })
      .from(UsersToNotificationsTable)
      .where(
        and(
          eq(UsersToNotificationsTable.notificationId, input.notificationId),
          eq(UsersToNotificationsTable.userId, userId),
        ),
      )
      .leftJoin(
        NotificationTable,
        eq(NotificationTable.id, UsersToNotificationsTable.notificationId),
      )) as (Notification & { ownerId: string })[] | undefined;
    if (!response || response.length === 0) {
      throw NotificationNotFoundException;
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

  async getAll(
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
        isRead: UsersToNotificationsTable.isRead,
        updatedAt: NotificationTable.updatedAt,
        createdAt: NotificationTable.createdAt,
      })
      .from(UsersToNotificationsTable)
      .where(
        and(
          eq(UsersToNotificationsTable.userId, userId),
          gt(UsersToNotificationsTable.notificationId, input.after),
        ),
      )
      .leftJoin(
        NotificationTable,
        eq(NotificationTable.id, UsersToNotificationsTable.notificationId),
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
  async updateOneById(
    userId: string,
    input: UpdateNotificationInput,
  ): Promise<AffectedCountModel> {
    return this.db.transaction(async (tx) => {
      const responseOfSelectingNotification = await tx
        .update(UsersToNotificationsTable)
        .set({
          isRead: true,
        })
        .where(
          and(
            eq(UsersToNotificationsTable.userId, userId),
            eq(UsersToNotificationsTable.isRead, false),
            or(
              ...input.notificationIds.map((id) =>
                eq(UsersToNotificationsTable.notificationId, id),
              ),
            ),
          ),
        )
        .returning();
      if (
        !responseOfSelectingNotification ||
        responseOfSelectingNotification.length === 0
      ) {
        throw NotificationNotFoundException;
      }

      return {
        totCount: input.notificationIds.length,
        successCount: responseOfSelectingNotification.length,
      };
    });
  }
  /* ============================== Update Operations ============================== */

  /* ============================== Delete Operations ============================== */
  async deleteSomeById(
    userId: string,
    input: DeleteNotificationInput,
  ): Promise<AffectedCountModel> {
    const response = await this.db
      .delete(UsersToNotificationsTable)
      .where(
        and(
          eq(UsersToNotificationsTable.userId, userId),
          inArray(
            UsersToNotificationsTable.notificationId,
            input.notificationIds,
          ),
        ),
      )
      .returning();
    return {
      totCount: input.notificationIds.length,
      successCount: response.length,
    };
  }
  /* ============================== Delete Operations ============================== */
}
