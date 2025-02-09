import { UserGenderEnum } from '../enums';

export type UserGenderType = keyof typeof UserGenderEnum;

export const UserGenderValues = Object.values(UserGenderEnum) as [
  string,
  ...string[],
];
