import { NotFoundException } from '@nestjs/common';

export const EnvironmentSupabaseNotFoundException = new NotFoundException({
  case: 'E-ENV-001',
  message: 'Cannot find some environment variables about supabase',
});
