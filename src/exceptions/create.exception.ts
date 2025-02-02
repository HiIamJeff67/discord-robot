import { ForbiddenException } from '@nestjs/common';

export const CreateUserException = new ForbiddenException({
  case: 'E-CREATE-001',
  messsage: 'Failed to create the user',
});

export const CreateUserInfoException = new ForbiddenException({
  case: 'E-CREATE-002',
  message: 'Failed to create the user info',
});

export const CreateUserAuthException = new ForbiddenException({
  case: 'E-CREATE-003',
  message: 'Failed to create the user auth',
});
