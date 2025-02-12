import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsIn, MaxLength, MinLength } from 'class-validator';
import {
  MaxDisplayNameLength,
  MaxSelfIntroductionLength,
  MinDisplayNameLength,
  MinSelfIntroductionLength,
} from '../../constants';
import {
  UserGenderType,
  UserGenderValues,
  UserStatusType,
  UserStatusValues,
} from '../../types';
import { UserGenderEnum, UserStatusEnum } from '../../enums';

@InputType()
export class CreateUserInfoInput {
  @Field(() => String)
  @MinLength(MinDisplayNameLength)
  @MaxLength(MaxDisplayNameLength)
  displayName: string;

  @Field(() => UserStatusEnum)
  @IsIn(UserStatusValues)
  status: UserStatusType;

  @Field(() => UserGenderEnum)
  @IsIn(UserGenderValues)
  gender: UserGenderType;

  @Field(() => GraphQLISODateTime, { nullable: true })
  birthDate?: Date | null;

  @Field(() => String, { nullable: true })
  @MinLength(MinSelfIntroductionLength)
  @MaxLength(MaxSelfIntroductionLength)
  selfIntroduction?: string | null;
}
