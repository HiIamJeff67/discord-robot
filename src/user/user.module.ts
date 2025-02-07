import { Module } from '@nestjs/common';
import { UserInfoService } from './user.service';
import { UserInfoResolver } from './user.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';

@Module({
  imports: [DrizzleModule, AccessTokenCacheModule],
  providers: [UserInfoResolver, UserInfoService],
})
export class UserInfoModule {}
