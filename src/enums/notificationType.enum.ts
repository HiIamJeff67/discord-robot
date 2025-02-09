import { registerEnumType } from '@nestjs/graphql';

export const NotificationEnum = {
  System: 'System',
  Security: 'Security',
  AD: 'AD',
  FriendRequest: 'FriendRequest',
} as const;

registerEnumType(NotificationEnum, {
  name: 'NotificationEnum',
});
