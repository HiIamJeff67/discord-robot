import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserPlanEnum, UserRoleEnum, UserStatusEnum } from './enum.schema';
import { relations } from 'drizzle-orm';
import { UserInfoTable } from './userInfo.schema';
import { UserAuthTable } from './userAuth.schema';
import { UsersToNotifications } from './usersToNotifications.schema';

export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userName: text('name').unique().notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    role: UserRoleEnum('role').notNull().default('NonCertified'),
    plan: UserPlanEnum('plan').notNull().default('Free'),
    refreshToken: text('refreshToken').notNull(),
    userAgent: text('userAgent').notNull(),
    status: UserStatusEnum('status').notNull().default('Online'),
  },
  (table) => {
    return {
      userNameIndex: uniqueIndex('user_userNameIndex').on(table.userName),
      emailIndex: uniqueIndex('user_emailIndex').on(table.email),
      roleIndex: index('user_roleIndex').on(table.role),
      planIndex: index('user_planIndex').on(table.plan),
      userAgentIndex: index('user_userAgentIndex').on(table.userAgent),
      statusIndex: index('user_statusIndex').on(table.status),
    };
  },
);

export const UserRelation = relations(UserTable, ({ one, many }) => ({
  info: one(UserInfoTable),
  auth: one(UserAuthTable),
  usersToNotifications: many(UsersToNotifications),
}));
