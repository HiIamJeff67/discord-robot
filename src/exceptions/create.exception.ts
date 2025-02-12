import { ForbiddenException } from '@nestjs/common';

export const CreateUserException = new ForbiddenException({
  case: 'E-Create-001',
  messsage: 'Failed to create the user',
});

export const CreateUserInfoException = new ForbiddenException({
  case: 'E-Create-002',
  message: 'Failed to create the user info',
});

export const CreateUserAuthException = new ForbiddenException({
  case: 'E-Create-003',
  message: 'Failed to create the user auth',
});

export const CreateUserSettingException = new ForbiddenException({
  case: 'E-Create-004',
  message: 'Failed to create the user setting',
});

export const CreateNotificationException = new ForbiddenException({
  case: 'E-Create-005',
  message: 'Failed to create the notification',
});

export const CreateUsersToNotificationException = new ForbiddenException({
  case: 'E-Create-006',
  message: 'Failed to create the link from users to notification',
});
