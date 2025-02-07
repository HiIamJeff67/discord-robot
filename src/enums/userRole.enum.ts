import { registerEnumType } from '@nestjs/graphql';

export const UserRoleEnum = {
  NonCertified: 'NonCertified', // for user without the email authorization
  Certified: 'Certified', // for normal user
  AlphaExplorer: 'AlphaExplorer', // for inner test staffs, on stage 1
  BetaExplorer: 'BetaExplorer', // for inner test staffs, on stage 2
  GammaExplorer: 'GammaExplorer', // for inner test staffs, on stage 3
  Developer: 'Developer',
  Admin: 'Admin',
} as const;

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
});
