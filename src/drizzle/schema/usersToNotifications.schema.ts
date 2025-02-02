import { index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './user.schema';
import { NotificationTable } from './notification.schema';
import { relations } from 'drizzle-orm';

export const UsersToNotifications = pgTable(
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
  UsersToNotifications,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UsersToNotifications.userId],
      references: [UserTable.id],
    }),
    notification: one(NotificationTable, {
      fields: [UsersToNotifications.notificationId],
      references: [NotificationTable.id],
    }),
  }),
);
