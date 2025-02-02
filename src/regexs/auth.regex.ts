export const OnlyEnglishAndNumberRegex = /^[a-zA-Z0-9]+$/;

export const OnlyChineseAndEnglishAndNumberRegex =
  /^[a-zA-Z0-9_\-\u4e00-\u9fa5 ]+$/;

export const RequiredLowerAndUpperCaseEnglishAndNumberAndSignRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{};:'",.<>/?\\|`~_+=\-]).{8,}$/;

export const TokenExpireTimeRegex =
  /^(?:[1-9][0-9]*[dhm]|[1-9][0-9]*)(?:[dhm])$/;
