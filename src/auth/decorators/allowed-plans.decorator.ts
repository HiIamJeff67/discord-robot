import { Reflector } from '@nestjs/core';
import { UserPlanType } from '../../types';

export const AllowedPlans = Reflector.createDecorator<UserPlanType[]>();
