import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateMyInfoInput } from './create-user.input';
import { UserPlanEnum, UserRoleEnum } from '../../enums';
import { IsIn } from 'class-validator';
import {
  UserPlanType,
  UserPlanValues,
  UserRoleType,
  UserRoleValues,
} from '../../types';

@InputType()
export class UpdateMyInfoInput extends PartialType(CreateMyInfoInput) {}

@InputType()
export class UpdateMyRoleInput {
  @Field(() => UserRoleEnum)
  @IsIn(UserRoleValues)
  role: UserRoleType;
}

@InputType()
export class UpdateMyPlanInput {
  @Field(() => UserPlanEnum)
  @IsIn(UserPlanValues)
  plan: UserPlanType;
}
