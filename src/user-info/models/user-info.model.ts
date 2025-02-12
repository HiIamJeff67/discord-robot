import {
  Field,
  GraphQLISODateTime,
  Int,
  IntersectionType,
  ObjectType,
} from '@nestjs/graphql';
import {
  MaxDisplayNameLength,
  MaxSelfIntroductionLength,
  MaxUserNameLength,
  MinDisplayNameLength,
  MinSelfIntroductionLength,
  MinUserNameLength,
} from '../../constants';
import {
  IsDate,
  IsIn,
  IsInt,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGenderEnum, UserStatusEnum } from '../../enums';
import { UserGenderType, UserStatusType, UserStatusValues } from '../../types';
import {
  AccessTokenDataModel,
  AffectedCountModel,
  getPaginatedModel,
} from '../../models';

/* ============================== Type Models ============================== */
@ObjectType()
export class PublicUserInfo {
  @Field(() => String)
  @MinLength(MinUserNameLength)
  @MaxLength(MaxUserNameLength)
  userName: string;

  @Field(() => String)
  @MinLength(MinDisplayNameLength)
  @MaxLength(MaxDisplayNameLength)
  displayName: string;

  @Field(() => Int)
  @IsInt()
  inviteCode: number;

  @Field(() => String, { nullable: true })
  @IsUrl()
  avatarURL?: string | null;

  @Field(() => String, { nullable: true })
  @MinLength(MinSelfIntroductionLength)
  @MaxLength(MaxSelfIntroductionLength)
  selfIntroduction?: string | null;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  createdAt: Date;
}

@ObjectType()
export class PrivateUserInfo {
  @Field(() => String)
  @MinLength(MinUserNameLength)
  @MaxLength(MaxUserNameLength)
  userName: string;

  @Field(() => String)
  @MinLength(MinDisplayNameLength)
  @MaxLength(MaxDisplayNameLength)
  displayName: string;

  @Field(() => Int)
  @IsInt()
  inviteCode: number;

  @Field(() => String, { nullable: true })
  @IsUrl()
  avatarURL?: string | null;

  @Field(() => UserStatusEnum)
  @IsIn(UserStatusValues)
  status: UserStatusType;

  @Field(() => UserGenderEnum)
  @IsIn(UserStatusValues)
  gender: UserGenderType;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  birthDate: Date | null;

  @Field(() => String, { nullable: true })
  @MinLength(MinSelfIntroductionLength)
  @MaxLength(MaxSelfIntroductionLength)
  selfIntroduction?: string | null;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  createdAt: Date;
}

@ObjectType()
export class AffectedPrivateUserInfo extends AffectedCountModel {
  @Field(() => PrivateUserInfo)
  userInfo: PrivateUserInfo;
}

@ObjectType()
export class PaginatedPublicUserInfos extends getPaginatedModel(
  PublicUserInfo,
) {}
/* ============================== Type Models ============================== */

/* ============================== Output Models ============================== */
@ObjectType()
export class PublicUserInfoOutput extends IntersectionType(
  PublicUserInfo,
  AccessTokenDataModel,
) {}

@ObjectType()
export class PrivateUserInfoOutput extends IntersectionType(
  PrivateUserInfo,
  AccessTokenDataModel,
) {}

@ObjectType()
export class AffectedPrivateUserInfoOutput extends IntersectionType(
  AffectedPrivateUserInfo,
  AccessTokenDataModel,
) {}

@ObjectType()
export class PaginatedPublicUserInfosOutput extends IntersectionType(
  PaginatedPublicUserInfos,
  AccessTokenDataModel,
) {}
/* ============================== Output Models ============================== */
