import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTREFRESHSYMBOL } from '../../constants';
import { ConfigType } from '@nestjs/config';
import { AccessTokenCacheManager } from '../../access-token-cache/access-token-cache.manager';
import { DRIZZLE } from '../../drizzle/drizzle.module';
import { DrizzleDB } from '../../drizzle/types/drizzle';
import { Request } from 'express';
import {
  TokenPayloadInterface,
  ValidateTokenDataInterface,
} from '../../interfaces';
import {
  ApiRefreshAccessTokenException,
  AuthInvalidRefreshTokenException,
  AuthMissingTokenException,
  AuthUserAgentNotMatchException,
} from '../../exceptions';
import { extractRefreshTokenFromCookies } from '../../cookie/extractors';
import { UserTable } from '../../drizzle/schema/user.schema';
import { eq } from 'drizzle-orm';
import { UserPlanType, UserRoleType } from '../../types';
import { SecureGeneratorService } from '../../secret-generator/secret-generator.service';
import jwtRefreshConfig from '../configs/jwt-refresh.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWTREFRESHSYMBOL,
) {
  constructor(
    private readonly secureGeneratorService: SecureGeneratorService,
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(jwtRefreshConfig.KEY)
    private readonly jwtRefreshConfiguration: ConfigType<
      typeof jwtRefreshConfig
    >,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractRefreshTokenFromCookies,
      ]),
      secretOrKey: jwtRefreshConfiguration.secret as string,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: TokenPayloadInterface,
  ): Promise<ValidateTokenDataInterface> {
    const currentRefreshToken = ExtractJwt.fromExtractors([
      extractRefreshTokenFromCookies,
    ])(request);
    if (!currentRefreshToken) {
      throw AuthMissingTokenException;
    }

    const user = (await this.db.query.UserTable.findFirst({
      where: eq(UserTable.id, payload.sub),
      columns: {
        id: true,
        userName: true,
        email: true,
        userAgent: true,
        role: true,
        plan: true,
      },
    })) as
      | {
          id: string;
          userName: string;
          email: string;
          userAgent: string;
          role: UserRoleType;
          plan: UserPlanType;
        }
      | undefined;
    if (!user) {
      throw AuthInvalidRefreshTokenException;
    }
    if (user.userAgent !== request.headers['user-agent']) {
      throw AuthUserAgentNotMatchException;
    }

    const newAccessTokenData =
      await this.secureGeneratorService.generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      });
    const responseOfSettingCache = await this.accessTokenCacheManager.set(
      newAccessTokenData,
      user,
    );
    if (!responseOfSettingCache) {
      throw ApiRefreshAccessTokenException;
    }

    return {
      ...user,
      accessTokenData: newAccessTokenData,
    };
  }
}
