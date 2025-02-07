import { registerEnumType } from '@nestjs/graphql';

export const UserPlanEnum = {
  Free: 'Free',
  Pro: 'Pro',
  Ultimate: 'Ultimate',
  Enterprise: 'Enterprise',
} as const;

registerEnumType(UserPlanEnum, {
  name: 'UserPlanEnum',
});
