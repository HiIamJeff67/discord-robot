import { z } from 'zod';
import * as regexs from '../regexs';
import * as exceptions from '../exceptions';
import * as constants from '../constants';

export const RegisterInputSchema = z.object({
  userName: z
    .string()
    .regex(
      regexs.OnlyEnglishAndNumberRegex,
      exceptions.TypeUserNameFormException.message,
    )
    .min(
      constants.MinUserNameLength,
      exceptions.TypeUserNameLengthException.message,
    )
    .max(
      constants.MaxUserNameLength,
      exceptions.TypeUserNameLengthException.message,
    ),
  displayName: z
    .string()
    .regex(
      regexs.OnlyChineseAndEnglishAndNumberRegex,
      exceptions.TypeDisplayNameFormException.message,
    )
    .min(
      constants.MinDisplayNameLength,
      exceptions.TypeDisplayNameLengthException.message,
    )
    .max(
      constants.MaxDisplayNameLength,
      exceptions.TypeDisplayNameLengthException.message,
    ),
  email: z.string().email(exceptions.TypeEmailFormException.message),
  password: z
    .string()
    .regex(
      regexs.RequiredLowerAndUpperCaseEnglishAndNumberAndSignRegex,
      exceptions.TypePasswordFormException.message,
    )
    .min(
      constants.MinPasswordLength,
      exceptions.TypePasswordLengthException.message,
    ),
});

export type RegisterInputType = z.infer<typeof RegisterInputSchema>;

export const RegisterOutputSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.string().regex(regexs.TokenExpireTimeRegex),
});

export type RegisterOutputType = z.infer<typeof RegisterOutputSchema>;

// we don't notify the user if the login form is wrong
export const LoginInputSchema = z.object({
  account: z.string(),
  password: z
    .string()
    .regex(
      regexs.RequiredLowerAndUpperCaseEnglishAndNumberAndSignRegex,
      exceptions.TypePasswordFormException.message,
    )
    .min(
      constants.MinPasswordLength,
      exceptions.TypePasswordLengthException.message,
    ),
});

export const LoginOutputSchema = RegisterOutputSchema;

export type LoginInputType = z.infer<typeof LoginInputSchema>;

export type LoginOutputType = z.infer<typeof LoginOutputSchema>;
