import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { UserInfoResolver } from './user-info.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';
import { SupabaseStorageModule } from '../supabase-storage/supabase-storage.module';
import { UserInfoController } from './user-info.controller';

@Module({
  imports: [DrizzleModule, AccessTokenCacheModule, SupabaseStorageModule],
  controllers: [UserInfoController],
  providers: [UserInfoResolver, UserInfoService],
})
export class UserInfoModule {}
