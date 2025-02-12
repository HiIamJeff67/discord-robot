import { registerEnumType } from '@nestjs/graphql';

export const LanguageEnum = {
  English: 'English',
  Japanese: 'Japanese',
  TraditionalChinese: 'TraditionalChinese',
  SimplifiedChinese: 'SimplifiedChinese',
} as const;

registerEnumType(LanguageEnum, {
  name: 'LanguageEnum',
});
