import { Field, InputType, Int } from '@nestjs/graphql';
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

@InputType()
export class CreateUserSettingInput {
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
