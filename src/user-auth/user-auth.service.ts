import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { UserAuthTable } from '../drizzle/schema/userAuth.schema';
import { eq } from 'drizzle-orm';
import { UserAuth } from './models/user-auth.model';
import { UserNotFoundException } from '../exceptions';

@Injectable()
export class UserAuthService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /* ============================== Get Operations ============================== */
  async getMyAuth(userId: string): Promise<UserAuth> {
    const response = (await this.db.query.UserAuthTable.findFirst({
      where: eq(UserAuthTable.userId, userId),
      columns: {
        phoneNumber: true,
        discordId: true,
        googleId: true,
        spotifyId: true,
        twitchId: true,
        metaId: true,
        redditId: true,
        lineId: true,
        updatedAt: true,
      },
    })) as UserAuth | undefined;
    if (!response) {
      throw UserNotFoundException;
    }

    return response;
  }
  /* ============================== Get Operations ============================== */

  /* ============================== Update Operations ============================== */
  /* ============================== Update Operations ============================== */
}
