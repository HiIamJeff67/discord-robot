import { ForbiddenException, NotFoundException } from '@nestjs/common';

export const CacheSetAccessTokenException = new ForbiddenException({
  case: 'E-Cache-001',
  message: 'Failed to set the access token by using the cache manager',
});

export const CacheAccessTokenNotFoundException = new NotFoundException({
  case: 'E-Cache-002',
  message: 'Failed to find any access token by using the cache manager',
});
