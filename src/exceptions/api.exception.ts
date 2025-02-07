import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

export const ApiRefreshAccessTokenException = new ForbiddenException({
  case: 'E-A-100',
  message: 'Failed to refresh the access token',
});

export const ApiWithoutCookieException = new ForbiddenException({
  case: 'E-A-101',
  message: 'The request or response does not have any cookies',
});

export const ApiKeyNotFoundInCookieException = new ForbiddenException({
  case: 'E-A-102',
  message: 'Cannot find any data with the given key in the cookies',
});

export const ApiISOStringFormException = new InternalServerErrorException({
  case: 'E-A-500',
  message: 'The given string is not in the form of IOS time',
});

export const ApiJwtDateStringFormException = new InternalServerErrorException({
  case: 'E-A-501',
  message: 'The given string is not in the form of jwt date string',
});
