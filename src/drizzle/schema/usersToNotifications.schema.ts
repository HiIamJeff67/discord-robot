import { boolean, index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './user.schema';
import { NotificationTable } from './notification.schema';
import { relations } from 'drizzle-orm';

export const UsersToNotificationsTable = pgTable(
  'usersToNotifications',
  {
    userId: uuid('userId')
      .references(() => UserTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    notificationId: uuid('notificationId')
      .references(() => NotificationTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    isRead: boolean('isRead').notNull().default(false),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.notificationId] }),
      userIdIndex: index('usersToNotifications_userIdIndex').on(table.userId),
      notificationIdIndex: index('usersToNotifications_notificationIdIndex').on(
        table.notificationId,
      ),
    };
  },
);

export const UsersToNotificationsRelation = relations(
  UsersToNotificationsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UsersToNotificationsTable.userId],
      references: [UserTable.id],
    }),
    notification: one(NotificationTable, {
      fields: [UsersToNotificationsTable.notificationId],
      references: [NotificationTable.id],
    }),
  }),
);
