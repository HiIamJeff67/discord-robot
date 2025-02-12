import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { SupabaseStorageService } from '../supabase-storage/supabase-storage.service';
import { and, asc, count, desc, eq, gt, like, SQL } from 'drizzle-orm';
import { UserInfoTable } from '../drizzle/schema/userInfo.schema';
import { UserTable } from '../drizzle/schema/user.schema';
import { UpdateUserInfoInput } from './dto/update-user-info.input';
import { DeleteAccountInput } from './dto/delete-user-info.input';
import { GetRelativeUserInfosInput } from './dto/get-user-info.input';
import {
  AffectedPrivateUserInfo,
  PaginatedPublicUserInfos,
  PrivateUserInfo,
  PublicUserInfo,
} from './models/user-info.model';
import { AffectedCountModel } from '../models';
import {
  AuthPasswordNotMatchException,
  CacheUpdateAccessTokenException,
  UserNotFoundException,
} from '../exceptions';
import { SearchOrderEnum } from '../enums';
import { DefaultAfterValueForSearch } from '../constants';
import { AccessTokenInterface } from '../interfaces';
import { AccessTokenCacheManager } from '../access-token-cache/access-token-cache.manager';

@Injectable()
export class UserInfoService {
  constructor(
    private readonly storage: SupabaseStorageService,
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  /* ============================== Get Operations ============================== */
  async getOneByUserId(userId: string): Promise<PrivateUserInfo | undefined> {
    const response = (await this.db.query.UserInfoTable.findFirst({
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
    })) as PrivateUserInfo | undefined;
    if (!response) {
      throw UserNotFoundException;
    }

    return response;
  }

  async getOneByUserName(userName: string): Promise<PublicUserInfo> {
    const response = (await this.db.query.UserInfoTable.findFirst({
      where: eq(UserInfoTable.userName, userName),
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
    })) as PublicUserInfo | undefined;
    if (!response) {
      throw UserNotFoundException;
    }

    return response;
  }

  async getAllRelative(
    input: GetRelativeUserInfosInput,
  ): Promise<PaginatedPublicUserInfos> {
    const query = this.db
      .select({
        id: UserInfoTable.id,
        userName: UserInfoTable.userName,
        displayName: UserInfoTable.displayName,
        avatarURL: UserInfoTable.avatarURL,
        inviteCode: UserInfoTable.inviteCode,
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
      .limit(input.first + 1)) as (PublicUserInfo & { id: string })[];
    if (!response || response.length === 0) {
      throw UserNotFoundException;
    }

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
          inviteCode: info.inviteCode,
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
  /* ============================== Get Operations ============================== */

  /* ============================== Update Operations ============================== */
  async updateInfoByUserId(
    userId: string,
    accessTokenData: AccessTokenInterface,
    input: UpdateUserInfoInput,
  ): Promise<AffectedPrivateUserInfo> {
    return await this.db.transaction(async (tx) => {
      const responseOfUpdatingUserInfo = (await tx
        .update(UserInfoTable)
        .set({
          displayName: input.displayName,
          status: input.status,
          gender: input.gender,
          birthDate: input.birthDate,
          selfIntroduction: input.selfIntroduction,
        })
        .where(eq(UserInfoTable.userId, userId))
        .returning({
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
        })) as PrivateUserInfo[] | undefined;

      if (
        !responseOfUpdatingUserInfo ||
        responseOfUpdatingUserInfo.length !== 1
      ) {
        throw UserNotFoundException;
      }

      const responseOfUpdatingCache = await this.accessTokenCacheManager.update(
        accessTokenData,
        {
          status: responseOfUpdatingUserInfo[0].status,
        },
      );
      if (!responseOfUpdatingCache) {
        tx.rollback();
        throw CacheUpdateAccessTokenException;
      }

      return {
        userInfo: responseOfUpdatingUserInfo[0],
        totCount: Object.keys(input).length,
        successCount: Object.keys(input).filter(
          (key) => input[key] !== responseOfUpdatingUserInfo[0][key],
        ).length,
      };
    });
  }

  // only used by controller
  async updateAvatarByUserId(
    userId: string,
    userName: string,
    avatarFile: Express.Multer.File,
  ): Promise<AffectedCountModel> {
    const response = await this.db
      .update(UserInfoTable)
      .set({
        avatarURL: await this.storage.uploadAvatarFile(userName, avatarFile),
      })
      .where(eq(UserInfoTable.id, userId))
      .returning();

    if (!response || response.length !== 1) {
      throw UserNotFoundException;
    }

    return {
      totCount: 1,
      successCount: response.length,
    };
  }
  /* ============================== Update Operations ============================== */

  /* ============================== Delete Operations ============================== */
  async deleteOneByUserId(
    userId: string,
    input: DeleteAccountInput,
  ): Promise<AffectedCountModel> {
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

    const responseOfDeletingUser = await this.db
      .delete(UserTable)
      .where(eq(UserTable.id, userId))
      .returning();

    if (!responseOfDeletingUser || responseOfDeletingUser.length !== 1) {
      throw UserNotFoundException;
    }

    return {
      totCount: 1,
      successCount: responseOfDeletingUser.length,
    };
  }
  /* ============================== Delete Operations ============================== */
}
