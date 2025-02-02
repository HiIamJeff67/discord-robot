import { Ctx, Input, Mutation, Router, UseMiddlewares } from 'nestjs-trpc';
import {
  LoginInputSchema,
  LoginInputType,
  LoginOutputSchema,
  LoginOutputType,
  RegisterInputSchema,
  RegisterInputType,
  RegisterOutputSchema,
  RegisterOutputType,
} from './auth.schema';
import { AuthService } from './auth.service';
import { CookieService } from '../cookie/cookie.service';
import { AppContextInterface } from '../trpc/context/context.interface';
import { UserAgentPlaceholder } from '../constants';
import { TrpcLoggerMiddleware } from '../trpc/middleware/trpc-logger.middleware';

@UseMiddlewares(TrpcLoggerMiddleware)
@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  @Mutation({
    input: RegisterInputSchema,
    output: RegisterOutputSchema,
  })
  async defaultRegister(
    @Input() input: RegisterInputType,
    @Ctx() ctx: AppContextInterface,
  ): Promise<RegisterOutputType> {
    const userAgent = ctx.req.headers['user-agent'] ?? UserAgentPlaceholder;
    const response = await this.authService.defaultRegister(input, userAgent);
    this.cookieService.storeRefreshTokenCookie(
      response.refreshTokenData.refreshToken,
      ctx.res,
    );
    return response.accessTokenData;
  }

  @Mutation({
    input: LoginInputSchema,
    output: LoginOutputSchema,
  })
  async defaultLogin(
    @Input() input: LoginInputType,
    @Ctx() ctx: AppContextInterface,
  ): Promise<LoginOutputType> {
    const userAgent = ctx.req.headers['user-agent'] ?? UserAgentPlaceholder;
    const response = await this.authService.defaultLogin(input, userAgent);
    this.cookieService.storeRefreshTokenCookie(
      response.refreshTokenData.refreshToken,
      ctx.res,
    );
    return response.accessTokenData;
  }
}
