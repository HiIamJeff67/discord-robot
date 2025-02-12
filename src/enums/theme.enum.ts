import { registerEnumType } from '@nestjs/graphql';

export const ThemeEnum = {
  Dark: 'Dark',
  Light: 'Light',
  System: 'System',
} as const;

registerEnumType(ThemeEnum, {
  name: 'ThemeEnum',
});
