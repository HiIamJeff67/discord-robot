import { Field, ObjectType } from '@nestjs/graphql';
import {
  UserPlanType,
  UserPlanValues,
  UserRoleType,
  UserRoleValues,
} from '../../types';
import { IsEmail, IsIn, MaxLength, MinLength } from 'class-validator';
import { MaxUserNameLength, MinUserNameLength } from '../../constants';
import { UserPlanEnum, UserRoleEnum } from '../../enums';

@ObjectType()
export class UserAccount {
  @Field(() => String)
  @MinLength(MinUserNameLength)
  @MaxLength(MaxUserNameLength)
  userName: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => UserRoleEnum)
  @IsIn(UserRoleValues)
  role: UserRoleType; // re-generate the token while updating the role

  @Field(() => UserPlanEnum)
  @IsIn(UserPlanValues)
  plan: UserPlanType; // re-generate the token while updating the plan

  @Field(() => String)
  userAgent: string;
}

@ObjectType()
export class UserRole {
  @Field(() => UserRoleEnum)
  @IsIn(UserRoleValues)
  role: UserRoleType;
}

@ObjectType()
export class UserPlan {
  @Field(() => UserPlanEnum)
  @IsIn(UserPlanValues)
  plan: UserPlanType;
}
