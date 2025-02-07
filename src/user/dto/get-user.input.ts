import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsIn } from 'class-validator';
import {
  SearchOrderType,
  SearchOrderValues,
  SearchUserInputType,
  SearchUserInputValues,
  UserGenderType,
  UserGenderValues,
  UserStatusType,
  UserStatusValues,
} from '../../types';
import {
  SearchOrderEnum,
  SearchUserInputEnum,
  UserGenderEnum,
  UserStatusEnum,
} from '../../enums';
import { DefaultAfterValueForSearch } from '../../constants';

@InputType()
export class SortOptions {
  @Field(() => SearchOrderEnum, { defaultValue: SearchOrderEnum.Descending })
  @IsIn(SearchOrderValues)
  byUpdatedAt: SearchOrderType;

  @Field(() => SearchOrderEnum, { defaultValue: SearchOrderEnum.None })
  @IsIn(SearchOrderValues)
  byCreatedAt: SearchOrderType;
}

@InputType()
export class FilterOptions {
  @Field(() => UserStatusEnum, { nullable: true })
  @IsIn(UserStatusValues)
  status?: UserStatusType;

  @Field(() => UserGenderEnum, { nullable: true })
  @IsIn(UserGenderValues)
  gender?: UserGenderType;
}

@InputType()
export class GetRelativeUserInfosInput {
  @Field(() => String, { nullable: true })
  searchInput?: string;

  @Field(() => SearchUserInputEnum, {
    defaultValue: SearchUserInputEnum.ByDisplayName,
  })
  @IsIn(SearchUserInputValues)
  searchInputType: SearchUserInputType;

  @Field(() => SortOptions, { nullable: true })
  sortOptions?: SortOptions;

  @Field(() => FilterOptions, { nullable: true })
  filterOptions?: FilterOptions;

  @Field(() => Int, { defaultValue: 10 })
  first: number;

  @Field(() => String, { defaultValue: DefaultAfterValueForSearch }) // since the smallest character is ' '
  after: string;

  @Field(() => Int, { nullable: true })
  totCount?: number;
}
