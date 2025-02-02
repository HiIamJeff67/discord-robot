/*
 * we use this file to manage all the enums in our schema,
 * since if we don't do that, it may cause some circular dependency error
 * ex. purchaseOrder.schema.ts require 'postStatusEnum' and supplyOrder.schema.ts also need one,
 *     if we create 'postStatusEnum' on one of the above schema, then import that one on the other schema,
 *     it will run into the error when you execute npm run start:dev, despite the fact that Neon migration doesn't have this issue
 */

import { pgEnum } from 'drizzle-orm/pg-core';

/* ================================= Status Enums ================================= */
export const UserStatusEnum = pgEnum('userStatus', [
  'Online',
  'Offline',
  'AFK',
  'DoNotDisturb',
]);

export const UserGenderEnum = pgEnum('userGender', [
  'Male',
  'Female',
  'PreferNotToSay',
]);

export const UserRoleEnum = pgEnum('userRole', [
  'NonCertified', // for user without the email authorization
  'Certified', // for normal user
  'AlphaExplorer', // for inner test staffs, on stage 1
  'BetaExplorer', // for open test members, on stage 2
  'GammaExplorer', // for well-open test users, on stage 3
  'Developer',
  'Admin',
]);

export const UserPlanEnum = pgEnum('userPlan', [
  'Free',
  'Pro',
  'Ultimate',
  'Enterprise',
]);

export const NotificationTypeEnum = pgEnum('notificationType', [
  'System',
  'Security',
  'AD',
]);
/* ================================= Status Enums ================================= */
