import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentSupabaseNotFoundException } from '../exceptions/environment.exception';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE = Symbol('supabase-client');

@Module({
  providers: [
    {
      provide: SUPABASE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseAPIKey = configService.get<string>('SUPABASE_API_KEY');
        if (!supabaseUrl || !supabaseAPIKey) {
          throw EnvironmentSupabaseNotFoundException;
        }
        return createClient(supabaseUrl, supabaseAPIKey) as SupabaseClient;
      },
    },
  ],
})
export class SupabaseModule {}
