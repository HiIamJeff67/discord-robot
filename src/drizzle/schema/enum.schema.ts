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
} from '../../types';

/* ================================= Status Enums ================================= */
export const UserStatusEnum = pgEnum('userStatus', UserStatusValues);

export const UserGenderEnum = pgEnum('userGender', UserGenderValues);

export const UserRoleEnum = pgEnum('userRole', UserRoleValues);

export const UserPlanEnum = pgEnum('userPlan', UserPlanValues);

export const NotificationTypeEnum = pgEnum(
  'notificationType',
  NotificationValues,
);

export const UsersToUsersStatusEnum = pgEnum(
  'usersToUsersStatus',
  UsersToUsersStatusValues,
);
/* ================================= Status Enums ================================= */
