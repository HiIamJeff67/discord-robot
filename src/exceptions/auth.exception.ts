import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export const AuthMissingTokenException = new UnauthorizedException({
  case: 'E-Auth-001',
  message: 'The token is missing',
});

export const AuthInvalidTokenException = new UnauthorizedException({
  case: 'E-Auth-002',
  message: 'The token is invalid',
});

export const AuthInvalidAccessTokenException = new UnauthorizedException({
  case: 'E-Auth-003',
  message: 'The access token is invalid',
});

export const AuthInvalidRefreshTokenException = new UnauthorizedException({
  case: 'E-Auth-004',
  message: 'The refresh token is invalid',
});

export const AuthAccessTokenHasDifferentOwnerToRefreshToken =
  new UnauthorizedException({
    case: 'E-Auth-005',
    message: 'The access token has a different owner to the refresh token',
  });

export const AuthUserAgentNotMatchException = new UnauthorizedException({
  case: 'E-Auth-006',
  message: 'The given user agent is not the same to the previous one',
});

export const AuthPasswordNotMatchException = new UnauthorizedException({
  case: 'E-Auth-007',
  message: 'The given password is not match',
});

export const AuthContextWithoutUserException = new NotFoundException({
  case: 'E-Auth-008',
  message: 'The request context does not contain the user',
});

export const AuthUserRoleMiddlewareWithoutMetaException = new NotFoundException(
  {
    case: 'E-Auth-009',
    message: 'Missing allowedRoles for the user role middleware',
  },
);

export const AuthUserRoleNotMatchException = new UnauthorizedException({
  case: 'E-Auth-010',
  message: 'The role of the user cannot use this route',
});

export const AuthUserPlanMiddlewareWithoutMetaException = new NotFoundException(
  {
    case: 'E-Auth-011',
    message: 'Missing allowedPlans for the user role middleware',
  },
);

export const AuthUserPlanNotMatchException = new UnauthorizedException({
  case: 'E-Auth-012',
  message: 'The plan of the user cannot use this route',
});

export const AuthUserHasNoPermissonException = new UnauthorizedException({
  case: 'E-Auth-013',
  message: 'The user has no permission to see or visit this resource',
});
