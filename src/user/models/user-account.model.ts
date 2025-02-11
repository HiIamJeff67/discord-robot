import { Field, IntersectionType, ObjectType } from '@nestjs/graphql';
import {
  UserPlanType,
  UserPlanValues,
  UserRoleType,
  UserRoleValues,
} from '../../types';
import { IsEmail, IsIn, MaxLength, MinLength } from 'class-validator';
import { MaxUserNameLength, MinUserNameLength } from '../../constants';
import { UserPlanEnum, UserRoleEnum } from '../../enums';
import { AccessTokenDataModel } from '../../models';

/* ============================== Type Models ============================== */
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
/* ============================== Type Models ============================== */

/* ============================== Output Models ============================== */
@ObjectType()
export class UserAccountOutput extends IntersectionType(
  UserAccount,
  AccessTokenDataModel,
) {}
/* ============================== Output Models ============================== */
