import { ForbiddenException, NotFoundException } from '@nestjs/common';

export const CacheSetAccessTokenException = new ForbiddenException({
  case: 'E-Cache-001',
  message:
    'Failed to set the access token and the cached data by using the cache manager',
});

export const CacheAccessTokenNotFoundException = new NotFoundException({
  case: 'E-Cache-002',
  message:
    'Failed to find any access token and the cached data by using the cache manager',
});

export const CacheUpdateAccessTokenException = new ForbiddenException({
  case: 'E-Cache-003',
  message:
    'Failed to update the access token and the cached data by using cache manager',
});
