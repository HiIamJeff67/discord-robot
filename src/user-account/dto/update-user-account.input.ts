import { Field, InputType } from '@nestjs/graphql';
import { UserPlanEnum, UserRoleEnum } from '../../enums';
import { IsIn } from 'class-validator';
import {
  UserPlanType,
  UserPlanValues,
  UserRoleType,
  UserRoleValues,
} from '../../types';

@InputType()
export class UpdateAccountInput {
  @Field(() => UserRoleEnum)
  @IsIn(UserRoleValues)
  role: UserRoleType;

  @Field(() => UserPlanEnum)
  @IsIn(UserPlanValues)
  plan: UserPlanType;
}
