import { Module } from '@nestjs/common';
import { UserSettingService } from './user-setting.service';
import { UserSettingResolver } from './user-setting.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';

@Module({
  imports: [DrizzleModule, AccessTokenCacheModule],
  providers: [UserSettingResolver, UserSettingService],
})
export class UserSettingModule {}
