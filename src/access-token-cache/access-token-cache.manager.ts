import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AccessTokenInterface } from '../interfaces';
import { tokenFormStringToNumberSecond } from '../utils';
import {
  SetAccessTokenCacheInterface,
  CacheUserInterface,
} from '../interfaces/cache.interface';

export const AccessTokenCacheStore = 'accessToken';

@Injectable()
export class AccessTokenCacheManager {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(
    accessTokenData: AccessTokenInterface,
    cacheData: SetAccessTokenCacheInterface,
  ): Promise<CacheUserInterface | undefined> {
    return await this.cacheManager.set(
      `${AccessTokenCacheStore}:${accessTokenData.accessToken.replaceAll(' ', '')}`,
      { ...cacheData, expiresIn: accessTokenData.expiresIn },
      tokenFormStringToNumberSecond(accessTokenData.expiresIn) * 1000,
    );
  }

  async get(accessToken: string): Promise<CacheUserInterface | undefined> {
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
}
