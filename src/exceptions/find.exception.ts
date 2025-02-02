import { NotFoundException } from '@nestjs/common';

export const UserNotFoundException = new NotFoundException({
  case: 'E-FIND-001',
  message: 'Cannot found any users',
});

export const UserTokenNotFoundException = new NotFoundException({
  case: 'E-FIND-002',
  message: 'Cannot found any user token',
});
