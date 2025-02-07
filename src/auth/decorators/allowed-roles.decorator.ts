import { Reflector } from '@nestjs/core';
import { UserRoleType } from '../../types';

export const AllowedRoles = Reflector.createDecorator<UserRoleType[]>();
