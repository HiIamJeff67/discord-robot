import {
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserTable } from './schema';
import { UsersToUsersStatusPgEnum } from './enum.schema';
import { relations } from 'drizzle-orm';

export const UsersToUsersTable = pgTable(
  'usersToUsers',
  {
    fromUser: uuid('fromUser').references(() => UserTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    toUser: uuid('toUser').references(() => UserTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    status: UsersToUsersStatusPgEnum('status').notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.fromUser, table.toUser] }),
      fromUserIndex: uniqueIndex('usersToUsers_fromUserIndex').on(
        table.fromUser,
      ),
      toUserIndex: uniqueIndex('usersToUsers_toUserIndex').on(table.toUser),
    };
  },
);

export const FromUserRelationName = 'friend_requests_from';
export const ToUserRelationName = 'friend_requests_to';

export const UsersToUsersRelation = relations(UsersToUsersTable, ({ one }) => ({
  from: one(UserTable, {
    relationName: FromUserRelationName,
    fields: [UsersToUsersTable.fromUser],
    references: [UserTable.id],
  }),
  to: one(UserTable, {
    relationName: ToUserRelationName,
    fields: [UsersToUsersTable.toUser],
    references: [UserTable.id],
  }),
}));
