import { Inject, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MiddlewareOptions, TRPCMiddleware } from 'nestjs-trpc';
import { AppContextInterface } from '../../trpc/context/context.interface';
import { ConfigService } from '@nestjs/config';
import {
  ApiGenerateAccessTokenException,
  AuthAccessTokenHasDifferentOwnerToRefreshToken,
  AuthInvalidAccessTokenException,
  AuthInvalidRefreshTokenException,
  AuthMissingTokenException,
  AuthUserAgentNotMatchException,
  CacheAccessTokenNotFoundException,
} from '../../exceptions';
import { DRIZZLE } from '../../drizzle/drizzle.module';
import { DrizzleDB } from '../../drizzle/types/drizzle';
import { UserTable } from '../../drizzle/schema/user.schema';
import { eq } from 'drizzle-orm';
import { SecureGeneratorService } from '../../secret-generator/secret-generator.service';
import { addSeconds, IsJwtExpExpired } from '../../utils';
import { AccessTokenCacheManager } from '../../access-token-cache/access-token-cache.manager';
import {
  RawValidateTokenDataInterface,
  AccessTokenCacheDataInterface,
} from '../../interfaces';
import { CookieService } from '../../cookie/cookie.service';

@Injectable()
export class JwtAuthMiddleware implements TRPCMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly secureGeneratorService: SecureGeneratorService,
    private readonly cookieService: CookieService,
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  /* ============================== Refresh Access Token Operation ============================== */
  private async _refreshAccessToken(
    oldAccessToken: string,
    refreshToken: string,
  ): Promise<AccessTokenCacheDataInterface | undefined> {
    // make sure we delete the previous access token in our cache
    const responseOfDeletingCache =
      await this.accessTokenCacheManager.del(oldAccessToken);
    if (!responseOfDeletingCache) {
      throw CacheAccessTokenNotFoundException;
    }

    const decodedRefreshToken: RawValidateTokenDataInterface =
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

    const responseOfSelectingUser = await this.db
      .select({
        id: UserTable.id,
        userName: UserTable.userName,
        email: UserTable.email,
        role: UserTable.role,
        plan: UserTable.plan,
        refreshToken: UserTable.refreshToken,
        userAgent: UserTable.userAgent,
      })
      .from(UserTable)
      .where(eq(UserTable.id, decodedRefreshToken.sub));
    if (
      !responseOfSelectingUser ||
      responseOfSelectingUser.length === 0 ||
      refreshToken !== responseOfSelectingUser[0].refreshToken
    ) {
      throw AuthInvalidRefreshTokenException;
    }

    const newAccessTokenData =
      await this.secureGeneratorService.generateAccessToken({
        sub: responseOfSelectingUser[0].id,
        email: responseOfSelectingUser[0].email,
        role: responseOfSelectingUser[0].role,
        plan: responseOfSelectingUser[0].plan,
      });
    const responseOfSettingCache = await this.accessTokenCacheManager.set(
      newAccessTokenData,
      responseOfSelectingUser[0],
    );

    return responseOfSettingCache;
  }
  /* ============================== Refresh Access Token Operation ============================== */

  /* ============================== Built-in Implement Operation ============================== */
  async use(opts: MiddlewareOptions<AppContextInterface>) {
    const { ctx, next } = opts;
    const { req } = ctx;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw AuthMissingTokenException;
    }

    const currentAccessToken = authHeader.split(' ')[1];

    try {
      // would throw an error in verifyAsync() if jwt expired
      const decodedAccessToken: RawValidateTokenDataInterface =
        await this.jwtService.verifyAsync(currentAccessToken, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

      const responseOfSelectingUser =
        await this.accessTokenCacheManager.get(currentAccessToken);
      console.log(responseOfSelectingUser);
      if (
        !responseOfSelectingUser || // check if the given access token is in the whitelist
        IsJwtExpExpired(decodedAccessToken.exp) // check if expired token detected
      ) {
        throw new TokenExpiredError(
          currentAccessToken,
          addSeconds(decodedAccessToken.exp),
        );
      }
      if (req.headers['user-agent'] !== responseOfSelectingUser.userAgent) {
        throw AuthUserAgentNotMatchException;
      }

      ctx.user = {
        id: responseOfSelectingUser.id,
        userName: responseOfSelectingUser.userName,
        email: responseOfSelectingUser.email,
        role: responseOfSelectingUser.role,
        plan: responseOfSelectingUser.plan,
        userAgent: responseOfSelectingUser.userAgent,
      };
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error.message.startsWith('jwt expired')
      ) {
        try {
          const currentRefreshToken =
            this.cookieService.loadRefreshTokenCookie(req);
          const responseOfRefreshingAccessToken =
            await this._refreshAccessToken(
              currentAccessToken,
              currentRefreshToken.refreshToken,
            );
          if (!responseOfRefreshingAccessToken) {
            throw ApiGenerateAccessTokenException;
          }
          if (
            req.headers['user-agent'] !==
            responseOfRefreshingAccessToken.userAgent
          ) {
            throw AuthUserAgentNotMatchException;
          }

          ctx.user = {
            id: responseOfRefreshingAccessToken.id,
            userName: responseOfRefreshingAccessToken.userName,
            email: responseOfRefreshingAccessToken.email,
            role: responseOfRefreshingAccessToken.role,
            plan: responseOfRefreshingAccessToken.plan,
            userAgent: responseOfRefreshingAccessToken.userAgent,
          };
        } catch (error) {
          throw error;
        }
      } else {
        throw error;
      }
    }

    return next();
  }
  /* ============================== Built-in Implement Operation ============================== */
}
