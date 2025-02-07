import { SearchOrderEnum } from '../enums';

export type SearchOrderType = keyof typeof SearchOrderEnum;
export const SearchOrderValues = Object.values(SearchOrderEnum) as [
  string,
  ...string[],
];
