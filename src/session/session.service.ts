import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { UserTable } from '../drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import {
  UserNotFoundException,
  UserTokenNotFoundException,
} from '../exceptions';
import { SecureGeneratorService } from '../secret-generator/secret-generator.service';
import { CookieService } from '../cookie/cookie.service';
import { AccessTokenCacheManager } from '../access-token-cache/access-token-cache.manager';

@Injectable()
export class SessionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly secureGeneratorService: SecureGeneratorService,
    private readonly cookieService: CookieService,
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  async directlyLogoutById(id: string): Promise<{}> {
    return await this.db.transaction(async (tx) => {
      const responseOfUpdatingUserStatus = await tx
        .update(UserTable)
        .set({
          status: 'Offline',
        })
        .where(eq(UserTable.id, id))
        .returning({
          id: UserTable.id,
          email: UserTable.email,
          role: UserTable.role,
          plan: UserTable.plan,
        });
      if (
        !responseOfUpdatingUserStatus ||
        responseOfUpdatingUserStatus.length === 0
      ) {
        throw UserNotFoundException;
      }

      const tempTokenPayload = {
        sub: responseOfUpdatingUserStatus[0].id,
        email: responseOfUpdatingUserStatus[0].email,
        role: responseOfUpdatingUserStatus[0].role,
        plan: responseOfUpdatingUserStatus[0].plan,
      };
      const tempRefreshTokenData =
        await this.secureGeneratorService.generateRefreshToken(
          tempTokenPayload,
        );
      // const responseOfDeletingCache = await this.accessTokenCacheManager.del()

      return {};
    });
  }
}
