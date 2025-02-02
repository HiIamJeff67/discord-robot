import { SetMetadata } from '@nestjs/common';
import { UserRoleType } from '../../enums';

export const ALLOWED_ROLES_KEY = 'allowedRoles';

export const AllowedRoles = (...roles: UserRoleType[]) =>
  SetMetadata(ALLOWED_ROLES_KEY, roles);
