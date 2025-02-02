export type UserRoleType =
  | 'NonCertified' // for user without the email authorization
  | 'Certified' // for normal user
  | 'AlphaExplorer' // for inner test staffs, on stage 1
  | 'BetaExplorer' // for open test members, on stage 2
  | 'GammaExplorer' // for well-open test users, on stage 3
  | 'Developer'
  | 'Admin';

export const UserRoleTypes = [
  'NonCertified',
  'Certified',
  'AlphaExplorer',
  'BetaExplorer',
  'GammaExplorer',
  'Developer',
  'Admin',
];
