import { ValidateTokenDataInterface } from '../interfaces';

export const RefreshTokenPlaceholder: string = 'REFRESH_TOKEN_PLACEHOLDER';
export const UserAgentPlaceholder: string = 'USER_AGENT_PLACEHOLDER';

export const JWTPASSPORTUSERSYMBOL: string = 'jwt-user';
export const LoggedOutUserData: ValidateTokenDataInterface = {
  id: 'LOGGEDOUT',
  userName: 'LOGGEDOUT',
  email: 'LOGGEDOUT',
  role: 'NonCertified',
  plan: 'Free',
  userAgent: UserAgentPlaceholder,
};
