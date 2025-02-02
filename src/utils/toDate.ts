import { ApiJwtDateStringFormException } from '../exceptions';
import {
  isLowerEnglishLetter,
  isNumberString,
  addDays,
  addMinutes,
  addSeconds,
  addHours,
} from './index';

export const tokenFormStringToDate = function (
  tokenFormString: string,
  initDate: Date = new Date(),
): Date {
  const [value, form] = [
    tokenFormString.substring(0, tokenFormString.length - 1),
    tokenFormString.substring(tokenFormString.length - 1),
  ];
  if (
    tokenFormString.length < 2 ||
    !isLowerEnglishLetter(form) ||
    !isNumberString(value)
  ) {
    throw ApiJwtDateStringFormException;
  }
  switch (form) {
    case 'd':
      return addDays(Number(value), initDate);
    case 'h':
      return addHours(Number(value), initDate);
    case 'm':
      return addMinutes(Number(value), initDate);
    case 's':
      return addSeconds(Number(value), initDate);
    default:
      throw ApiJwtDateStringFormException;
  }
};

export const tokenFormStringToNumberSecond = function (
  tokenFormString: string,
): number {
  const [value, form] = [
    tokenFormString.substring(0, tokenFormString.length - 1),
    tokenFormString.substring(tokenFormString.length - 1),
  ];
  if (
    tokenFormString.length < 2 ||
    !isLowerEnglishLetter(form) ||
    !isNumberString(value)
  ) {
    throw ApiJwtDateStringFormException;
  }
  switch (form) {
    case 'd':
      return Number(value) * 24 * 60 * 60;
    case 'h':
      return Number(value) * 60 * 60;
    case 'm':
      return Number(value) * 60;
    case 's':
      return Number(value);
    default:
      throw ApiJwtDateStringFormException;
  }
};
