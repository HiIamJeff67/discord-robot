import { Field, ObjectType } from '@nestjs/graphql';
import { AccessTokenDataModel } from '../../models';
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

@ObjectType()
export class DefaultRegisterOutput extends AccessTokenDataModel {
  @Field(() => LanguageEnum)
  @IsIn(LanguageValues)
  language: LanguageType;

  @Field(() => TimeZoneEnum)
  @IsIn(TimeZoneValues)
  timeZone: TimeZoneType;

  @Field(() => ThemeEnum)
  @IsIn(ThemeValues)
  theme: ThemeType;
}
