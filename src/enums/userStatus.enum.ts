import { registerEnumType } from '@nestjs/graphql';

export const UserStatusEnum = {
  Online: 'Online',
  Offline: 'Offline',
  AFK: 'AFK',
  DoNotDisturb: 'DoNotDisturb',
} as const;

registerEnumType(UserStatusEnum, {
  name: 'UserStatusEnum',
});
