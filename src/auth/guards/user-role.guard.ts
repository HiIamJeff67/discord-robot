import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from '../decorators/allowed-roles.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get(AllowedRoles, context.getHandler());
    if (allowedRoles.length === 0) return false;

    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().req.user;
    if (!user || !user.role) return false;

    for (const allowedRole of allowedRoles) {
      if (user.role === allowedRole) return true;
    }

    return false;
  }
}
