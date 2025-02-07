import { UserPlanType, UserRoleType } from '../types';

export interface SetAccessTokenCacheInterface {
  id: string;
  userName: string;
  email: string;
  userAgent: string;
  role: UserRoleType;
  plan: UserPlanType;
}

export interface CacheUserInterface extends SetAccessTokenCacheInterface {
  expiresIn: string;
}
