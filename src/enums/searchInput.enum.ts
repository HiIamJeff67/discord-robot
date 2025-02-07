import { registerEnumType } from '@nestjs/graphql';

export const SearchUserInputEnum = {
  ByUserName: 'ByUserName',
  ByDisplayName: 'ByDisplayName',
  ByInviteCode: 'ByInviteCode',
} as const;

registerEnumType(SearchUserInputEnum, {
  name: 'SearchUserInputEnum',
});
