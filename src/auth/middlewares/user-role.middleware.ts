import { Injectable } from '@nestjs/common';
import { MiddlewareOptions, TRPCMiddleware } from 'nestjs-trpc';
import { AppContextInterface } from '../../trpc/context/context.interface';
import {
  AuthContextWithoutUserException,
  AuthUserRoleMiddlewareWithoutMetaException,
  AuthUserRoleNotMatchException,
} from '../../exceptions';
import { UserRoleType } from '../../enums';
import { ALLOWED_ROLES_KEY } from '../decorators/allowed-role.decorator';

@Injectable()
export class UserRoleMiddleware implements TRPCMiddleware {
  async use(opts: MiddlewareOptions<AppContextInterface>) {
    const { ctx, next, meta } = opts;

    if (!ctx.user) {
      throw AuthContextWithoutUserException;
    }

    const allowedRoles = (meta as Record<string, unknown>)?.[
      ALLOWED_ROLES_KEY
    ] as UserRoleType[];
    if (!allowedRoles || allowedRoles.length === 0) {
      throw AuthUserRoleMiddlewareWithoutMetaException;
    }

    if (!allowedRoles.includes(ctx.user.role)) {
      throw AuthUserRoleNotMatchException;
    }

    return next();
  }
}
