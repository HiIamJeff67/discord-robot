import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

export const ApiGenerateAccessTokenException = new ForbiddenException({
  case: 'E-A-100',
  message: 'Failed to generate an access token',
});

export const ApiGenerateRefreshTokenException = new ForbiddenException({
  case: 'E-A-101',
  message: 'Failed to generate a refresh token',
});

export const ApiISOStringFormException = new InternalServerErrorException({
  case: 'E-A-500',
  message: 'The given string is not in the form of IOS time',
});

export const ApiJwtDateStringFormException = new InternalServerErrorException({
  case: 'E-A-501',
  message: 'The given string is not in the form of jwt date string',
});
