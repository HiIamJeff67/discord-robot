import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  AccessTokenInterface,
  ValidateTokenDataInterface,
} from '../interfaces';
import { tokenFormStringToNumberSecond } from '../utils';
import { SetAccessTokenCacheInterface } from '../interfaces';
import { AuthInvalidAccessTokenException } from '../exceptions';

export const AccessTokenCacheStore = 'accessToken';

@Injectable()
export class AccessTokenCacheManager {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(
    accessTokenData: AccessTokenInterface,
    cacheData: SetAccessTokenCacheInterface,
  ): Promise<ValidateTokenDataInterface | undefined> {
    return await this.cacheManager.set(
      `${AccessTokenCacheStore}:${accessTokenData.accessToken.replaceAll(' ', '')}`,
      { ...cacheData, accessTokenData: accessTokenData },
      tokenFormStringToNumberSecond(accessTokenData.expiresIn) * 1000,
    );
  }

  async get(
    accessToken: string,
  ): Promise<ValidateTokenDataInterface | undefined> {
    return (
      (await this.cacheManager.get(
        `${AccessTokenCacheStore}:${accessToken.replaceAll(' ', '')}`,
      )) ?? undefined
    );
  }

  async del(accessToken: string): Promise<boolean> {
    return await this.cacheManager.del(
      `${AccessTokenCacheStore}:${accessToken}`,
    );
  }

  async update(
    accessTokenData: AccessTokenInterface,
    cacheData: Partial<SetAccessTokenCacheInterface>,
  ): Promise<ValidateTokenDataInterface | undefined> {
    const prevCacheData = await this.get(accessTokenData.accessToken);
    if (!prevCacheData) {
      throw AuthInvalidAccessTokenException;
    }

    const newCacheData: ValidateTokenDataInterface = {
      ...prevCacheData,
      ...cacheData, // replace with the new data
    };

    return await this.cacheManager.set(
      `${AccessTokenCacheStore}:${accessTokenData.accessToken.replaceAll(' ', '')}`,
      newCacheData,
      tokenFormStringToNumberSecond(accessTokenData.expiresIn) * 1000,
    );
  }
}
