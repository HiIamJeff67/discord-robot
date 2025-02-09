declare module 'user' {
  export const UserGenderEnum = {
    Male: 'Male',
    Female: 'Female',
    PreferNotToSay: 'PreferNotToSay',
  } as const;
  export type UserGenderType = keyof typeof UserGenderEnum;
  export const UserGenderValues = Object.values(UserGenderEnum) as [
    string,
    ...string[],
  ];

  export const UserPlanEnum = {
    Free: 'Free',
    Pro: 'Pro',
    Ultimate: 'Ultimate',
    Enterprise: 'Enterprise',
  } as const;
  export type UserPlanType = keyof typeof UserPlanEnum;
  export const UserPlanValues = Object.values(UserPlanEnum) as [
    string,
    ...string[],
  ];

  export const UserRoleEnum = {
    NonCertified: 'NonCertified', // for user without the email authorization
    Certified: 'Certified', // for normal user
    AlphaExplorer: 'AlphaExplorer', // for inner test staffs, on stage 1
    BetaExplorer: 'BetaExplorer', // for inner test staffs, on stage 2
    GammaExplorer: 'GammaExplorer', // for inner test staffs, on stage 3
    Developer: 'Developer',
    Admin: 'Admin',
  } as const;
  export type UserRoleType = keyof typeof UserRoleEnum;
  export const UserRoleValues = Object.values(UserRoleEnum) as [
    string,
    ...string[],
  ];

  export const UserStatusEnum = {
    Online: 'Online',
    Offline: 'Offline',
    AFK: 'AFK',
    DoNotDisturb: 'DoNotDisturb',
  } as const;
  export type UserStatusType = keyof typeof UserStatusEnum;
  export const UserStatusValues = Object.values(UserStatusEnum) as [
    string,
    ...string[],
  ];
}

declare module 'user-input' {
  export type AvatarFileType = Express.Multer.File;
}

declare module 'user-output' {
  export class UserInfo {
    userName: string;
    displayName: string;
    inviteCode: number;
    avatarURL?: string | null;
    status: UserStatusType;
    gender: UserGenderType;
    birthDate: Date | null;
    selfIntroduction?: string | null;
    updatedAt: Date;
    createdAt: Date;
  }
}
