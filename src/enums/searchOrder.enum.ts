import { registerEnumType } from '@nestjs/graphql';

export const SearchOrderEnum = {
  Ascending: 'Ascending',
  Descending: 'Descending',
  None: 'None',
} as const;

registerEnumType(SearchOrderEnum, {
  name: 'SearchOrderEnum',
});
