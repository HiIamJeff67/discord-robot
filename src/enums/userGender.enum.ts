import { registerEnumType } from '@nestjs/graphql';

export const UserGenderEnum = {
  Male: 'Male',
  Female: 'Female',
  PreferNotToSay: 'PreferNotToSay',
} as const;

registerEnumType(UserGenderEnum, {
  name: 'UserGenderEnum',
});
