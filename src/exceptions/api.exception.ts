import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const ApiRefreshAccessTokenException = new ForbiddenException({
  case: 'E-Api-100',
  message: 'Failed to refresh the access token',
});

export const ApiWithoutCookieException = new ForbiddenException({
  case: 'E-Api-101',
  message: 'The request or response does not have any cookies',
});

export const ApiKeyNotFoundInCookieException = new NotFoundException({
  case: 'E-Api-102',
  message: 'Cannot find any data with the given key in the cookies',
});

export const ApiListAvatarFileException = new InternalServerErrorException({
  case: 'E-Api-300',
  message: 'Failed to list the avatar bucket',
});
export const ApiUploadAvatarFileException = new InternalServerErrorException({
  case: 'E-Api-301',
  message: 'Failed to upload the given avatar file to the supabase storage',
});

export const ApiDeleteAvatarFileException = new InternalServerErrorException({
  case: 'E-Api-302',
  message: 'Failed to delete the avatar file of the given user',
});

export const ApiFailedToGetAvatarPublicUrlException = new ForbiddenException({
  case: 'E-Api-303',
  message: 'Failed to get the public url for the avatar of the given user',
});

export const ApiISOStringFormException = new InternalServerErrorException({
  case: 'E-Api-500',
  message: 'The given string is not in the form of IOS time',
});

export const ApiJwtDateStringFormException = new InternalServerErrorException({
  case: 'E-Api-501',
  message: 'The given string is not in the form of jwt date string',
});
