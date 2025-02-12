import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CookieService } from '../cookie/cookie.service';
import { DefaultRegisterOutput } from './models/register.model';
import { DefaultRegisterInput } from './dto/register.input';
import { DefaultLoginOutput } from './models/login.model';
import { DefaultLoginInput } from './dto/login.input';

@Resolver('auth')
export class AuthResolver {
  constructor(
    private readonly cookieService: CookieService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => DefaultRegisterOutput)
  async defaultRegister(
    @Args('input') input: DefaultRegisterInput,
    @Context() context: any,
  ): Promise<DefaultRegisterOutput> {
    const userAgent = context.req.headers['user-agent'];
    const acceptLanguage = context.req.headers.acceptLanguage;
    const response = await this.authService.defaultRegister(
      input,
      userAgent,
      acceptLanguage,
    );
    this.cookieService.storeRefreshTokenCookie(
      response.refreshTokenData.refreshToken,
      context.res,
    );
    return {
      ...response.accessTokenData,
      language: response.language,
      timeZone: response.timeZone,
      theme: response.theme,
    };
  }

  @Mutation(() => DefaultLoginOutput)
  async defaultLogin(
    @Args('input') input: DefaultLoginInput,
    @Context() context: any,
  ): Promise<DefaultLoginOutput> {
    const userAgent = context.req.headers['user-agent'];
    const response = await this.authService.defaultLogin(input, userAgent);
    this.cookieService.storeRefreshTokenCookie(
      response.refreshTokenData.refreshToken,
      context.res,
    );
    return {
      ...response.accessTokenData,
      language: response.language,
      timeZone: response.timeZone,
      theme: response.theme,
    };
  }
}
