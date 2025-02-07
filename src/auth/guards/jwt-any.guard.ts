import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function JwtAnyGuard(guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class MixinAnyGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (guards.length === 0) return false;

      for (const Guard of guards) {
        const guardInstance = new Guard();
        try {
          const result = await guardInstance.canActivate(context);
          if (result) return true;
        } catch (error) {
          // ignore error to do the next check
        }
      }
      return false; // if all the guards failed, then return false
    }
  }

  return mixin(MixinAnyGuard);
}
