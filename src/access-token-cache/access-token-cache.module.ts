import { Module } from '@nestjs/common';
import { AccessTokenCacheManager } from './access-token-cache.manager';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({})],
  providers: [AccessTokenCacheManager],
  exports: [AccessTokenCacheManager],
})
export class AccessTokenCacheModule {}
