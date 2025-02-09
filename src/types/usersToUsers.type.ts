import { UsersToUsersStatusEnum } from '../enums';

export type UsersToUsersStatusType = keyof typeof UsersToUsersStatusEnum;

export const UsersToUsersStatusValues = Object.values(
  UsersToUsersStatusEnum,
) as [string, ...string[]];
