import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { NotificationTypePgEnum } from './enum.schema';
import { relations } from 'drizzle-orm';
import { UsersToNotificationsTable } from './usersToNotifications.schema';

export const NotificationTable = pgTable(
  'notification',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    type: NotificationTypePgEnum('type'),
    linkId: text('linkId'),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => {
    return {
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
    usersToNotifications: many(UsersToNotificationsTable),
  }),
);
