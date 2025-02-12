import { index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { UserPlanPgEnum, UserRolePgEnum } from './enum.schema';
import { relations } from 'drizzle-orm';
import { UserInfoTable } from './userInfo.schema';
import { UserAuthTable } from './userAuth.schema';
import { UsersToNotificationsTable } from './usersToNotifications.schema';
import {
  FromUserRelationName,
  ToUserRelationName,
  UsersToUsersTable,
} from './usersToUsers.schema';
import { UserPlanEnum, UserRoleEnum } from '../../enums';
import { UserSettingTable } from './userSetting.schema';

export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userName: text('userName').unique().notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    role: UserPlanPgEnum('role').notNull().default(UserRoleEnum.NonCertified),
    plan: UserRolePgEnum('plan').notNull().default(UserPlanEnum.Free),
    refreshToken: text('refreshToken').notNull(),
    userAgent: text('userAgent').notNull(),
  },
  (table) => {
    return {
      userNameIndex: uniqueIndex('user_userNameIndex').on(table.userName),
      emailIndex: uniqueIndex('user_emailIndex').on(table.email),
      roleIndex: index('user_roleIndex').on(table.role),
      planIndex: index('user_planIndex').on(table.plan),
      userAgentIndex: index('user_userAgentIndex').on(table.userAgent),
    };
  },
);

export const UserRelation = relations(UserTable, ({ one, many }) => ({
  info: one(UserInfoTable),
  auth: one(UserAuthTable),
  setting: one(UserSettingTable),
  usersToNotifications: many(UsersToNotificationsTable),
  friendReqFrom: many(UsersToUsersTable, {
    relationName: FromUserRelationName,
  }),
  friendReqTo: many(UsersToUsersTable, {
    relationName: ToUserRelationName,
  }),
}));
