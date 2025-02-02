import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import * as regexs from '../../regexs';
import * as exceptions from '../../exceptions';
import * as constants from '../../constants';

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  auth: t.router({
    defaultRegister: publicProcedure
      .input(
        z.object({
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
        }),
      )
      .output(
        z.object({
          accessToken: z.string(),
          expiresIn: z.string().regex(regexs.TokenExpireTimeRegex),
        }),
      )
      .mutation(async () => 'PLACEHOLDER_DO_NOT_REMOVE' as any),
    defaultLogin: publicProcedure
      .input(
        z.object({
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
        }),
      )
      .output(
        z.object({
          accessToken: z.string(),
          expiresIn: z.string().regex(regexs.TokenExpireTimeRegex),
        }),
      )
      .mutation(async () => 'PLACEHOLDER_DO_NOT_REMOVE' as any),
  }),
});
export type AppRouter = typeof appRouter;
