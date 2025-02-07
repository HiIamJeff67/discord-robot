import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { and, asc, count, desc, eq, gt, like, lt, SQL } from 'drizzle-orm';
import { UserInfoTable } from '../drizzle/schema/userInfo.schema';
import { UserAuthTable } from '../drizzle/schema/userAuth.schema';
import {
  UpdateMyInfoInput,
  UpdateMyPlanInput,
  UpdateMyRoleInput,
} from './dto/update-user.input';
import { UserTable } from '../drizzle/schema/user.schema';
import { DeleteMeInput } from './dto/delete-user.input';
import {
  AuthPasswordNotMatchException,
  UserNotFoundException,
} from '../exceptions';
import {
  UserGenderType,
  UserPlanType,
  UserRoleType,
  UserStatusType,
} from '../types';
import { GetRelativeUserInfosInput } from './dto/get-user.input';
import { SearchOrderEnum } from '../enums';
import { PaginatedUserInfos, UserInfo } from './models/user-info.model';
import { DefaultAfterValueForSearch } from '../constants';
import { UserAuth } from './models/user-auth.model';
import { UserPlan, UserRole } from './models/user-account.model';

interface GetUserInfoInterface {
  userName: string;
  displayName: string;
  avatarURL: string | null;
  status: UserStatusType;
  inviteCode: number;
  gender: UserGenderType;
  birthDate: Date;
  selfIntroduction: string;
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class UserInfoService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getUserInfo(userId: string): Promise<UserInfo | undefined> {
    return (await this.db.query.UserInfoTable.findFirst({
      where: eq(UserInfoTable.userId, userId),
      columns: {
        userName: true,
        displayName: true,
        avatarURL: true,
        status: true,
        inviteCode: true,
        gender: true,
        birthDate: true,
        selfIntroduction: true,
        updatedAt: true,
        createdAt: true,
      },
    })) as GetUserInfoInterface | undefined;
  }

  async getRelativeUserInfos(
    input: GetRelativeUserInfosInput,
  ): Promise<PaginatedUserInfos> {
    const query = this.db
      .select({
        id: UserInfoTable.id,
        userName: UserInfoTable.userName,
        displayName: UserInfoTable.displayName,
        avatarURL: UserInfoTable.avatarURL,
        status: UserInfoTable.status,
        inviteCode: UserInfoTable.inviteCode,
        gender: UserInfoTable.gender,
        birthDate: UserInfoTable.birthDate,
        selfIntroduction: UserInfoTable.selfIntroduction,
        updatedAt: UserInfoTable.updatedAt,
        createdAt: UserInfoTable.createdAt,
      })
      .from(UserInfoTable);

    const sqls: SQL[] = [];
    const orders: SQL[] = [];

    if (input.searchInput && input.searchInput.length !== 0) {
      switch (input.searchInputType) {
        case 'ByUserName':
          sqls.push(like(UserInfoTable.userName, `%${input.searchInput}%`));
          break;
        case 'ByDisplayName':
          sqls.push(like(UserInfoTable.displayName, `%${input.searchInput}%`));
          break;
        case 'ByInviteCode':
          sqls.push(like(UserInfoTable.inviteCode, `${input.searchInput}%`));
          break;
        default:
          sqls.push(like(UserInfoTable.userName, `%${input.searchInput}%`));
          break;
      }
    }

    if (input.filterOptions?.status) {
      sqls.push(eq(UserInfoTable.status, input.filterOptions.status));
    }
    if (input.filterOptions?.gender) {
      sqls.push(eq(UserInfoTable.gender, input.filterOptions.gender));
    }

    orders.push(
      input.sortOptions &&
        input.sortOptions.byUpdatedAt === SearchOrderEnum.Ascending
        ? asc(UserInfoTable.updatedAt)
        : desc(UserInfoTable.updatedAt),
    );
    orders.push(
      input.sortOptions &&
        input.sortOptions.byCreatedAt === SearchOrderEnum.Ascending
        ? asc(UserInfoTable.createdAt)
        : desc(UserInfoTable.createdAt),
    );

    sqls.push(gt(UserInfoTable.id, input.after));

    if (!input.totCount) {
      const [{ totalCount }] = await this.db
        .select({ totalCount: count() })
        .from(UserInfoTable)
        .where(and(...sqls));
      input.totCount = totalCount;
    }

    const response = (await query
      .where(and(...sqls))
      .orderBy(...orders)
      // fetch one more data to check if there's a next page or not
      .limit(input.first + 1)) as {
      id: string;
      userName: string;
      displayName: string;
      avatarURL: string;
      status: UserStatusType;
      inviteCode: number;
      gender: UserGenderType;
      birthDate: Date;
      selfIntroduction: string;
      updatedAt: Date;
      createdAt: Date;
    }[];

    const hasNextPage: boolean = response.length > input.first;
    const hasPrevPage: boolean = input.after !== DefaultAfterValueForSearch;
    if (response.length > input.first) response.pop(); // pop the extra data we just fetch

    return {
      edges: response.map((info) => ({
        cursor: info.id,
        node: {
          userName: info.userName,
          displayName: info.displayName,
          avatarURL: info.avatarURL,
          status: info.status,
          inviteCode: info.inviteCode,
          gender: info.gender,
          birthDate: info.birthDate,
          selfIntroduction: info.selfIntroduction,
          updatedAt: info.updatedAt,
          createdAt: info.createdAt,
        },
      })),
      totalCount: input.totCount,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
    };
  }

  async getMyAuth(userId: string): Promise<UserAuth | undefined> {
    return await this.db.query.UserAuthTable.findFirst({
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
    });
  }

  async updateMyInfo(
    userId: string,
    input: UpdateMyInfoInput,
  ): Promise<UserInfo> {
    const response = (await this.db
      .update(UserInfoTable)
      .set({
        displayName: input.displayName,
        avatarURL: input.avatarURL,
        status: input.status,
        gender: input.gender,
        birthDate: input.birthDate,
        selfIntroduction: input.selfIntroduction,
      })
      .where(eq(UserInfoTable.userId, userId))
      .returning({
        userName: UserInfoTable.userName,
        displayName: UserInfoTable.displayName,
        avatarURL: UserInfoTable.avatarURL,
        status: UserInfoTable.status,
        inviteCode: UserInfoTable.inviteCode,
        gender: UserInfoTable.gender,
        birthDate: UserInfoTable.birthDate,
        selfIntroduction: UserInfoTable.selfIntroduction,
        updatedAt: UserInfoTable.updatedAt,
        createdAt: UserInfoTable.createdAt,
      })) as UserInfo[] | undefined;

    if (!response || response.length === 0) {
      throw UserNotFoundException;
    }

    return response[0];
  }

  async updateMyRole(
    userId: string,
    input: UpdateMyRoleInput,
  ): Promise<UserRole> {
    const response = (await this.db
      .update(UserTable)
      .set({
        role: input.role,
      })
      .where(eq(UserTable.id, userId))
      .returning({
        role: UserTable.role,
      })) as UserRole[] | undefined;

    if (!response || response.length === 0) {
      throw UserNotFoundException;
    }

    return response[0];
  }

  async updateMyPlan(
    userId: string,
    input: UpdateMyPlanInput,
  ): Promise<UserPlan> {
    const response = (await this.db
      .update(UserTable)
      .set({
        plan: input.plan,
      })
      .where(eq(UserTable.id, userId))
      .returning({
        plan: UserTable.plan,
      })) as UserPlan[] | undefined;

    if (!response || response.length === 0) {
      throw UserNotFoundException;
    }

    return response[0];
  }

  async deleteMe(userId: string, input: DeleteMeInput): Promise<UserInfo> {
    const responseOfSelectingUser = await this.db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
      columns: {
        password: true,
      },
    });
    if (!responseOfSelectingUser) {
      throw UserNotFoundException;
    }

    const pwMatch = await bcrypt.compare(
      input.password,
      responseOfSelectingUser.password,
    );
    if (!pwMatch) {
      throw AuthPasswordNotMatchException;
    }

    const responseOfDeletingUser = (await this.db
      .delete(UserTable)
      .where(eq(UserTable.id, userId))
      .returning({
        userName: UserInfoTable.userName,
        displayName: UserInfoTable.displayName,
        avatarURL: UserInfoTable.avatarURL,
        status: UserInfoTable.status,
        inviteCode: UserInfoTable.inviteCode,
        gender: UserInfoTable.gender,
        birthDate: UserInfoTable.birthDate,
        selfIntroduction: UserInfoTable.selfIntroduction,
        updatedAt: UserInfoTable.updatedAt,
        createdAt: UserInfoTable.createdAt,
      })) as UserInfo[] | undefined;

    if (!responseOfDeletingUser || responseOfDeletingUser.length === 0) {
      throw UserNotFoundException;
    }

    return responseOfDeletingUser[0];
  }
}
