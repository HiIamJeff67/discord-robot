import { Module } from '@nestjs/common';
import { SupabaseStorageService } from './supabase-storage.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  providers: [SupabaseStorageService],
  imports: [SupabaseModule, DrizzleModule],
  exports: [SupabaseStorageService],
})
export class SupabaseStorageModule {}
