import { Injectable } from '@nestjs/common';
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc';
import { AppContextInterface } from '../../trpc/context/context.interface';
import {
  AuthContextWithoutUserException,
  AuthUserPlanMiddlewareWithoutMetaException,
  AuthUserPlanNotMatchException,
} from '../../exceptions';
import { UserPlanType } from '../../enums';
import { ALLOWED_PLANS_KEY } from '../decorators';

@Injectable()
export class UserPlanMiddleware implements TRPCMiddleware {
  async use(opts: MiddlewareOptions<AppContextInterface>) {
    const { ctx, next, meta } = opts;

    if (!ctx.user) {
      throw AuthContextWithoutUserException;
    }

    const allowedPlans = (meta as Record<string, unknown>)?.[
      ALLOWED_PLANS_KEY
    ] as UserPlanType[];
    if (!allowedPlans || allowedPlans.length === 0) {
      throw AuthUserPlanMiddlewareWithoutMetaException;
    }

    if (!allowedPlans.includes(ctx.user.plan)) {
      throw AuthUserPlanNotMatchException;
    }

    return next();
  }
}
