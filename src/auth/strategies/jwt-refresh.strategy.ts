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
import { UserPlanType, UserRoleType, UserStatusType } from '../../types';
import { SecureGeneratorService } from '../../secret-generator/secret-generator.service';
import jwtRefreshConfig from '../configs/jwt-refresh.config';
import { UserInfoTable } from '../../drizzle/schema/userInfo.schema';

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

    const user = (await this.db
      .select({
        id: UserTable.id,
        userName: UserTable.userName,
        email: UserTable.email,
        userAgent: UserTable.userAgent,
        status: UserInfoTable.status,
        role: UserTable.role,
        plan: UserTable.plan,
      })
      .from(UserTable)
      .where(eq(UserTable.id, payload.sub))
      .leftJoin(UserInfoTable, eq(UserInfoTable.userId, UserTable.id))) as
      | {
          id: string;
          userName: string;
          email: string;
          userAgent: string;
          status: UserStatusType;
          role: UserRoleType;
          plan: UserPlanType;
        }[]
      | undefined;
    if (!user || user.length === 0) {
      throw AuthInvalidRefreshTokenException;
    }
    if (user[0].userAgent !== request.headers['user-agent']) {
      throw AuthUserAgentNotMatchException;
    }

    const newAccessTokenData =
      await this.secureGeneratorService.generateAccessToken({
        sub: user[0].id,
        email: user[0].email,
        role: user[0].role,
        plan: user[0].plan,
      });
    const responseOfSettingCache = await this.accessTokenCacheManager.set(
      newAccessTokenData,
      user[0],
    );
    if (!responseOfSettingCache) {
      throw ApiRefreshAccessTokenException;
    }

    return {
      ...user[0],
      accessTokenData: newAccessTokenData,
    };
  }
}
