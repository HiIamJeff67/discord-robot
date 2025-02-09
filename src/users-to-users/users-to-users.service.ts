import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { and, eq } from 'drizzle-orm';
import { UserInfoTable } from '../drizzle/schema/userInfo.schema';
import { UserNotFoundException } from '../exceptions';
import { UsersToUsersTable } from '../drizzle/schema/usersToUsers.schema';
import { UsersToUsersStatusEnum } from '../enums';

@Injectable()
export class UsersToUsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /* ============================== Create Operations ============================== */
  async createFriendRequest(userId: string, inviteCode: number) {
    const toUser = await this.db.query.UserInfoTable.findFirst({
      where: eq(UserInfoTable.inviteCode, inviteCode),
      columns: {
        userId: true,
      },
    });
    if (!toUser) {
      throw UserNotFoundException;
    }

    return await this.db
      .insert(UsersToUsersTable)
      .values({
        fromUser: userId,
        toUser: toUser.userId,
        status: UsersToUsersStatusEnum.Pending,
      })
      .returning({
        status: UsersToUsersTable.status,
      });
  }
  /* ============================== Create Operations ============================== */

  /* ============================== Get Operations ============================== */
  async getFriendRequestsFromMe(userId: string) {
    return await this.db
      .select({
        friendStatus: UsersToUsersTable.status,
        userName: UserInfoTable.userName,
        displayName: UserInfoTable.displayName,
        inviteCode: UserInfoTable.inviteCode,
        avatarURL: UserInfoTable.avatarURL,
        status: UserInfoTable.status,
        gender: UserInfoTable.gender,
        birthDate: UserInfoTable.birthDate,
        selfIntroduction: UserInfoTable.selfIntroduction,
        updatedAt: UserInfoTable.updatedAt,
        createdAt: UserInfoTable.createdAt,
      })
      .from(UsersToUsersTable)
      .where(
        and(
          eq(UsersToUsersTable.fromUser, userId),
          eq(UsersToUsersTable.status, 'Pending'),
        ),
      )
      .leftJoin(
        UserInfoTable,
        eq(UserInfoTable.userId, UsersToUsersTable.toUser),
      );
  }

  async getFriendRequestsToMe(userId: string) {
    return await this.db
      .select({
        friendStatus: UsersToUsersTable.status,
        userName: UserInfoTable.userName,
        displayName: UserInfoTable.displayName,
        inviteCode: UserInfoTable.inviteCode,
        avatarURL: UserInfoTable.avatarURL,
        status: UserInfoTable.status,
        gender: UserInfoTable.gender,
        birthDate: UserInfoTable.birthDate,
        selfIntroduction: UserInfoTable.selfIntroduction,
        updatedAt: UserInfoTable.updatedAt,
        createdAt: UserInfoTable.createdAt,
      })
      .from(UsersToUsersTable)
      .where(
        and(
          eq(UsersToUsersTable.toUser, userId),
          eq(UsersToUsersTable.status, 'Pending'),
        ),
      )
      .leftJoin(
        UserInfoTable,
        eq(UserInfoTable.userId, UsersToUsersTable.fromUser),
      );
  }
  /* ============================== Get Operations ============================== */

  /* ============================== Update Operations ============================== */
  async acceptFriendRequest(userId: string, from: string) {}
  /* ============================== Update Operations ============================== */

  /* ============================== Delete Operations ============================== */
  async cancelFriendRequest(userId: string, to: string) {
    return this.db
      .delete(UsersToUsersTable)
      .where(
        and(
          eq(UsersToUsersTable.fromUser, userId),
          eq(UsersToUsersTable.toUser, to),
          eq(UsersToUsersTable.status, 'Pending'),
        ),
      )
      .returning({
        status: UsersToUsersTable.status,
      });
  }

  async rejectFriendRequest(userId: string, from: string) {
    return this.db
      .delete(UsersToUsersTable)
      .where(
        and(
          eq(UsersToUsersTable.fromUser, from),
          eq(UsersToUsersTable.toUser, userId),
          eq(UsersToUsersTable.status, 'Pending'),
        ),
      )
      .returning({
        status: UsersToUsersTable.status,
      });
  }
  /* ============================== Delete Operations ============================== */
}
