import { UserPlanEnum } from '../enums';

export type UserPlanType = keyof typeof UserPlanEnum;

export const UserPlanValues = Object.values(UserPlanEnum) as [
  string,
  ...string[],
];
