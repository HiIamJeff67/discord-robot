import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { SecureGeneratorService } from '../secret-generator/secret-generator.service';
import { UserTable } from '../drizzle/schema/user.schema';
import {
  CreateUserAuthException,
  CreateUserException,
  CreateUserInfoException,
  AuthPasswordNotMatchException,
  UserNotFoundException,
  UserTokenNotFoundException,
} from '../exceptions';
import { UserInfoTable } from '../drizzle/schema/userInfo.schema';
import { addMinutes, isEmail } from '../utils';
import { UserAuthTable } from '../drizzle/schema/userAuth.schema';
import { eq } from 'drizzle-orm';
import { RefreshTokenPlaceholder } from '../constants';
import { AccessTokenCacheManager } from '../access-token-cache/access-token-cache.manager';
import { CacheSetAccessTokenException } from '../exceptions/cache.exception';
import { DefaultRegisterInput } from './dto/register.input';
import { DefaultLoginInput } from './dto/login.input';
import { UserPlanType, UserRoleType, UserStatusType } from '../types';
import { SetAccessTokenCacheInterface } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly secureGeneratorService: SecureGeneratorService,
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async defaultRegister(
    input: DefaultRegisterInput,
    userAgent: string | undefined, // set by request
  ) {
    return await this.db.transaction(async (tx) => {
      const hash = await bcrypt.hash(
        input.password,
        Number(this.configService.get('SALT_OR_ROUND')),
      );

      const responseOfCreatingUser = (await tx
        .insert(UserTable)
        .values({
          userName: input.userName,
          email: input.email,
          password: hash,
          refreshToken: RefreshTokenPlaceholder,
          userAgent: userAgent ?? '',
        })
        .returning({
          id: UserTable.id,
          userName: UserTable.userName,
          email: UserTable.email,
          userAgent: UserTable.userAgent,
          role: UserTable.role,
          plan: UserTable.plan,
        })) as
        | {
            id: string;
            userName: string;
            email: string;
            userAgent: string;
            role: UserRoleType;
            plan: UserPlanType;
          }[]
        | undefined;
      if (!responseOfCreatingUser || responseOfCreatingUser.length === 0) {
        throw CreateUserException;
      }

      const responseOfCreatingUserInfo = await tx
        .insert(UserInfoTable)
        .values({
          userId: responseOfCreatingUser[0].id,
          userName: input.userName,
          displayName: input.displayName,
        })
        .returning();
      if (
        !responseOfCreatingUserInfo ||
        responseOfCreatingUserInfo.length === 0
      ) {
        throw CreateUserInfoException;
      }

      const responseOfCreatingUserAuth = await tx
        .insert(UserAuthTable)
        .values({
          userId: responseOfCreatingUser[0].id,
          authCode: this.secureGeneratorService.generateAuthCode(6),
          authCodeExpiredAt: addMinutes(1),
        })
        .returning();
      if (
        !responseOfCreatingUserAuth ||
        responseOfCreatingUserAuth.length === 0
      ) {
        throw CreateUserAuthException;
      }

      const accessTokenData =
        await this.secureGeneratorService.generateAccessToken({
          sub: responseOfCreatingUser[0].id,
          email: responseOfCreatingUser[0].email,
          role: responseOfCreatingUser[0].role,
          plan: responseOfCreatingUser[0].plan,
        });
      const refreshTokenData =
        await this.secureGeneratorService.generateRefreshToken({
          sub: responseOfCreatingUser[0].id,
          email: responseOfCreatingUser[0].email,
          role: responseOfCreatingUser[0].role,
          plan: responseOfCreatingUser[0].plan,
        });

      const responseOfSettingCache = await this.accessTokenCacheManager.set(
        accessTokenData,
        {
          ...responseOfCreatingUser[0],
          status: responseOfCreatingUserInfo[0].status as UserStatusType,
        },
      );
      if (!responseOfSettingCache) {
        throw CacheSetAccessTokenException;
      }
      const responseOfUpdatingUser = await tx
        .update(UserTable)
        .set({
          refreshToken: refreshTokenData.refreshToken,
          userAgent: userAgent,
        })
        .returning();
      if (!responseOfUpdatingUser || responseOfUpdatingUser.length === 0) {
        throw UserNotFoundException;
      }

      return {
        accessTokenData: accessTokenData,
        refreshTokenData: refreshTokenData,
      };
    });
  }

  async defaultLogin(input: DefaultLoginInput, userAgent: string | undefined) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingUser = (await tx
        .select({
          id: UserTable.id,
          userName: UserTable.userName,
          email: UserTable.email,
          status: UserInfoTable.status,
          role: UserTable.role,
          plan: UserTable.plan,
          userAgent: UserTable.userAgent,
          password: UserTable.password,
        })
        .from(UserTable)
        .where(
          isEmail(input.account)
            ? eq(UserTable.email, input.account)
            : eq(UserTable.userName, input.account),
        )
        .leftJoin(UserInfoTable, eq(UserInfoTable.userId, UserTable.id))) as {
        id: string;
        userName: string;
        email: string;
        userAgent: string;
        status: UserStatusType;
        role: UserRoleType;
        plan: UserPlanType;
        password: string;
      }[];
      if (!responseOfSelectingUser || responseOfSelectingUser.length === 0) {
        throw UserNotFoundException;
      }

      const pwMatch = await bcrypt.compare(
        input.password,
        responseOfSelectingUser[0].password,
      );
      if (!pwMatch) throw AuthPasswordNotMatchException;

      const accessTokenData =
        await this.secureGeneratorService.generateAccessToken({
          sub: responseOfSelectingUser[0].id,
          email: responseOfSelectingUser[0].email,
          role: responseOfSelectingUser[0].role,
          plan: responseOfSelectingUser[0].plan,
        });
      const refreshTokenData =
        await this.secureGeneratorService.generateRefreshToken({
          sub: responseOfSelectingUser[0].id,
          email: responseOfSelectingUser[0].email,
          role: responseOfSelectingUser[0].role,
          plan: responseOfSelectingUser[0].plan,
        });

      const responseOfSettingCache = this.accessTokenCacheManager.set(
        accessTokenData,
        responseOfSelectingUser[0],
      );
      if (!responseOfSettingCache) {
        throw CacheSetAccessTokenException;
      }
      const responseOfUpdatingUser = await tx
        .update(UserTable)
        .set({
          refreshToken: refreshTokenData.refreshToken,
          ...(userAgent ? { userAgent: userAgent } : {}),
        })
        .returning();
      if (!responseOfUpdatingUser || responseOfUpdatingUser.length === 0) {
        throw UserTokenNotFoundException;
      }

      return {
        accessTokenData: accessTokenData,
        refreshTokenData: refreshTokenData,
      };
    });
  }
}
