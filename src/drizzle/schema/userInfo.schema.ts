import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserTable } from './user.schema';
import { UserGenderEnum, UserPlanEnum } from './enum.schema';
import { relations } from 'drizzle-orm';

export const UserInfoTable = pgTable(
  'userInfo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
      .references(() => UserTable.id, {
        onDelete: 'cascade',
      })
      .unique()
      .notNull(),
    displayName: text('displayName').notNull(),
    avatarURL: text('avatarURL'),
    gender: UserGenderEnum('gender').notNull().default('PreferNotToSay'),
    birthDate: timestamp('birthDate'),
    selfIntroduction: text('selfIntroduction'),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdIndex: uniqueIndex('userInfo_userIdIndex').on(table.userId),
      birthDateIndex: index('userInfo_birthDateIndex').on(table.birthDate),
      updatedAtIndex: index('userInfo_updatedAtIndex').on(table.updatedAt),
      createdAtIndex: index('userInfo_createdAtIndex').on(table.createdAt),
    };
  },
);

export const UserInfoRelation = relations(UserInfoTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserInfoTable.userId],
    references: [UserTable.id],
  }),
}));
