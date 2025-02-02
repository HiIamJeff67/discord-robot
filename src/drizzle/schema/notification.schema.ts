import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserTable } from './user.schema';
import { NotificationTypeEnum } from './enum.schema';
import { relations } from 'drizzle-orm';
import { UsersToNotifications } from './usersToNotifications.schema';

export const NotificationTable = pgTable(
  'notification',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    creatorId: uuid('creatorId').references(() => UserTable.id),
    title: text('title').notNull(),
    content: text('content').notNull(),
    type: NotificationTypeEnum('type'),
    link: text('link'),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => {
    return {
      creatorIdIndex: uniqueIndex('notification_creatorIdIndex').on(
        table.creatorId,
      ),
      titleIndex: index('notification_titleIndex').on(table.title),
      contentIndex: index('notification_contentIndex').on(table.content),
      typeIndex: index('notification_typeIndex').on(table.type),
      updatedAtIndex: index('notification_updatedAtIndex').on(table.updatedAt),
      createdAtIndex: index('notification_createdAtIndex').on(table.createdAt),
    };
  },
);

export const NotificationRelation = relations(
  NotificationTable,
  ({ many }) => ({
    usersToNotifications: many(UsersToNotifications),
  }),
);
