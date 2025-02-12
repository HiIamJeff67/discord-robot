/*
 * we use this file to manage all the enums in our schema,
 * since if we don't do that, it may cause some circular dependency error
 * ex. purchaseOrder.schema.ts require 'postStatusEnum' and supplyOrder.schema.ts also need one,
 *     if we create 'postStatusEnum' on one of the above schema, then import that one on the other schema,
 *     it will run into the error when you execute npm run start:dev, despite the fact that Neon migration doesn't have this issue
 */

import { pgEnum } from 'drizzle-orm/pg-core';
import {
  NotificationValues,
  UserGenderValues,
  UserPlanValues,
  UsersToUsersStatusValues,
  UserRoleValues,
  UserStatusValues,
  LanguageValues,
  ThemeValues,
  TimeZoneValues,
} from '../../types';

/* ================================= Status Enums ================================= */
export const UserStatusPgEnum = pgEnum('userStatusEnum', UserStatusValues);

export const UserGenderPgEnum = pgEnum('userGenderEnum', UserGenderValues);

export const UserRolePgEnum = pgEnum('userRoleEnum', UserRoleValues);

export const UserPlanPgEnum = pgEnum('userPlanEnum', UserPlanValues);

export const NotificationTypePgEnum = pgEnum(
  'notificationTypeEnum',
  NotificationValues,
);

export const UsersToUsersStatusPgEnum = pgEnum(
  'usersToUsersStatusEnum',
  UsersToUsersStatusValues,
);
/* ================================= Status Enums ================================= */

/* ================================= Setting Enums ================================= */
export const LanguagePgEnum = pgEnum('languageEnum', LanguageValues);

export const ThemePgEnum = pgEnum('themeEnum', ThemeValues);

export const TimeZonePgEnum = pgEnum('timeZoneEnum', TimeZoneValues);
/* ================================= Setting Enums ================================= */
