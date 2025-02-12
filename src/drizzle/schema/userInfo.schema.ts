import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserTable } from './user.schema';
import { UserGenderPgEnum, UserStatusPgEnum } from './enum.schema';
import { relations } from 'drizzle-orm';
import { UserGenderEnum, UserStatusEnum } from '../../enums';

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
    userName: text('userName')
      .references(() => UserTable.userName, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull()
      .unique(),
    displayName: text('displayName').notNull(),
    inviteCode: serial('inviteCode').notNull().unique(),
    avatarURL: text('avatarURL'),
    status: UserGenderPgEnum('status')
      .notNull()
      .default(UserStatusEnum.Offline),
    gender: UserStatusPgEnum('gender')
      .notNull()
      .default(UserGenderEnum.PreferNotToSay),
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
      userNameIndex: uniqueIndex('userInfo_userNameIndex').on(table.userName),
      displayNameIndex: index('userInfo_displayNameIndex').on(
        table.displayName,
      ),
      inviteCodeIndex: uniqueIndex('userInfo_inviteCodeIndex').on(
        table.inviteCode,
      ),
      statusIndex: index('userInfo_statusIndex').on(table.status),
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
