import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiWithoutCookieException } from '../../exceptions';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RequestCookies = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const gqlRequest = gqlContext.getContext().req;
    if (!gqlRequest || !gqlRequest.cookies) {
      throw ApiWithoutCookieException;
    }

    // notice that gqlRequest.cookies[data] may be undefined
    return data ? gqlRequest.cookies[data] : gqlRequest.cookies;
  },
);
