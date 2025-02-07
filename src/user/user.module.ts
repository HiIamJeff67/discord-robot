import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';
import { SupabaseStorageModule } from '../supabase-storage/supabase-storage.module';
import { UserController } from './user.controller';

@Module({
  imports: [DrizzleModule, AccessTokenCacheModule, SupabaseStorageModule],
  controllers: [UserController],
  providers: [UserResolver, UserService],
})
export class UserModule {}
