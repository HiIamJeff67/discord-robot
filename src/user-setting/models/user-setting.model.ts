import { Field, Int, IntersectionType, ObjectType } from '@nestjs/graphql';
import { LanguageEnum, ThemeEnum, TimeZoneEnum } from '../../enums';
import { IsIn } from 'class-validator';
import {
  LanguageType,
  LanguageValues,
  ThemeType,
  ThemeValues,
  TimeZoneType,
  TimeZoneValues,
} from '../../types';
import { AccessTokenDataModel, AffectedCountModel } from '../../models';

/* ============================== Type Models ============================== */
@ObjectType()
export class UserSetting {
  @Field(() => LanguageEnum)
  @IsIn(LanguageValues)
  language: LanguageType;

  @Field(() => TimeZoneEnum)
  @IsIn(TimeZoneValues)
  timeZone: TimeZoneType;

  @Field(() => ThemeEnum)
  @IsIn(ThemeValues)
  theme: ThemeType;

  @Field(() => Int)
  generalSettingsCode: number;

  @Field(() => Int)
  privacySettingsCode: number;
}

@ObjectType()
export class AffectedUserSetting extends AffectedCountModel {
  @Field(() => UserSetting)
  userSetting: UserSetting;
}
/* ============================== Type Models ============================== */

/* ============================== Output Models ============================== */
@ObjectType()
export class UserSettingOutput extends IntersectionType(
  UserSetting,
  AccessTokenDataModel,
) {}

@ObjectType()
export class AffectedUserSettingOutput extends IntersectionType(
  AffectedUserSetting,
  AccessTokenDataModel,
) {}
/* ============================== Output Models ============================== */
