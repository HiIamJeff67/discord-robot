import { ThemeEnum } from '../enums';

export type ThemeType = keyof typeof ThemeEnum;

export const ThemeValues = Object.values(ThemeEnum) as [string, ...string[]];
