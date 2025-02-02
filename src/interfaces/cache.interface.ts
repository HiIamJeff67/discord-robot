import { ValidateTokenDataInterface } from './auth.interface';

export interface AccessTokenCacheDataInterface
  extends ValidateTokenDataInterface {
  expiresIn: string;
}
