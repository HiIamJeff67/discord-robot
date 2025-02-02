import { SetMetadata } from '@nestjs/common';
import { UserPlanType } from '../../enums';

export const ALLOWED_PLANS_KEY = 'allowedPlans';
export const AlowedPlans = (...plans: UserPlanType[]) =>
  SetMetadata(ALLOWED_PLANS_KEY, plans);
