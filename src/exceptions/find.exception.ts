import { NotFoundException } from '@nestjs/common';

export const UserNotFoundException = new NotFoundException({
  case: 'E-Find-001',
  message: 'Cannot found any users',
});

export const UserNotFoundInSocketException = new NotFoundException({
  case: 'E-Find-002',
  message: 'Cannot found any user in the socket map',
});

export const UserTokenNotFoundException = new NotFoundException({
  case: 'E-Find-003',
  message: 'Cannot found any user token',
});

export const NotificationNotFoundException = new NotFoundException({
  case: 'E-Find-004',
  message: 'Cannot found any notifications',
});
