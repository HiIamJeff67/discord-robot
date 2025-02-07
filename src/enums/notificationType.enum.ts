import { registerEnumType } from '@nestjs/graphql';

export const NotificationEnum = {
  System: 'System',
  Security: 'Security',
  AD: 'AD',
} as const;

registerEnumType(NotificationEnum, {
  name: 'NotificationEnum',
});
