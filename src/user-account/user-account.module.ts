import { Module } from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { UserAccountResolver } from './user-account.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';

@Module({
  imports: [DrizzleModule, AccessTokenCacheModule],
  providers: [UserAccountResolver, UserAccountService],
})
export class UserAccountModule {}
