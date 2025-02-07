import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidateTokenDataInterface } from '../../interfaces';
import { UserNotFoundException } from '../../exceptions';

export const User = createParamDecorator(
  (
    data: keyof ValidateTokenDataInterface | undefined,
    ctx: ExecutionContext,
  ) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const user = gqlContext.getContext().req.user;
    if (!user) throw UserNotFoundException;
    return data ? user.data : user;
  },
);
