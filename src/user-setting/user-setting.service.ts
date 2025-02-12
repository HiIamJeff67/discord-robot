import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import { UserSettingTable } from '../drizzle/schema/userSetting.schema';
import { UserNotFoundException } from '../exceptions';
import { UpdateUserSettingInput } from './dto/update-user-setting.input';
import { AffectedUserSetting, UserSetting } from './models/user-setting.model';
import { AccessTokenCacheManager } from '../access-token-cache/access-token-cache.manager';
import {
  AccessTokenInterface,
  ValidateTokenDataInterface,
} from '../interfaces';

@Injectable()
export class UserSettingService {
  constructor(
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  /* ============================== Get Operations ============================== */
  async getOneByUserId(userId: string): Promise<UserSetting> {
    const response = (await this.db.query.UserSettingTable.findFirst({
      where: eq(UserSettingTable.userId, userId),
      columns: {
        language: true,
        timeZone: true,
        theme: true,
        generalSettingsCode: true,
        privacySettingsCode: true,
      },
    })) as UserSetting | undefined;
    if (!response) {
      throw UserNotFoundException;
    }

    return response;
  }
  /* ============================== Get Operations ============================== */

  /* ============================== Update Operations ============================== */
  async updateOneByUserId(
    userId: string,
    accessTokenData: AccessTokenInterface,
    input: UpdateUserSettingInput,
  ): Promise<AffectedUserSetting> {
    return await this.db.transaction(async (tx) => {
      const responseOfUpdatingUserSetting = (await tx
        .update(UserSettingTable)
        .set({
          language: input.language,
          timeZone: input.timeZone,
          theme: input.theme,
          generalSettingsCode: input.generalSettingsCode,
          privacySettingsCode: input.privacySettingsCode,
        })
        .where(eq(UserSettingTable.userId, userId))
        .returning({
          language: UserSettingTable.language,
          timeZone: UserSettingTable.timeZone,
          theme: UserSettingTable.theme,
          generalSettingsCode: UserSettingTable.generalSettingsCode,
          privacySettingsCode: UserSettingTable.privacySettingsCode,
        })) as UserSetting[] | undefined;
      if (
        !responseOfUpdatingUserSetting ||
        responseOfUpdatingUserSetting.length !== 1
      ) {
        throw UserNotFoundException;
      }

      // use the below method for the future extension
      let countOfUpdateField = 0;
      let updateCacheFields: Partial<ValidateTokenDataInterface> = {};
      if (
        input.generalSettingsCode !==
        responseOfUpdatingUserSetting[0].generalSettingsCode
      ) {
        updateCacheFields = {
          ...updateCacheFields,
          ...{
            generalSettingsCode:
              responseOfUpdatingUserSetting[0].generalSettingsCode,
          },
        };
        countOfUpdateField += 1;
      }
      if (
        input.privacySettingsCode !==
        responseOfUpdatingUserSetting[0].privacySettingsCode
      ) {
        updateCacheFields = {
          ...updateCacheFields,
          ...{
            privacySettingsCode:
              responseOfUpdatingUserSetting[0].privacySettingsCode,
          },
        };
        countOfUpdateField += 1;
      }

      if (countOfUpdateField > 0) {
        tx.rollback();
        this.accessTokenCacheManager.update(accessTokenData, updateCacheFields);
      }

      return {
        userSetting: responseOfUpdatingUserSetting[0],
        totCount: Object.keys(input).length,
        successCount: Object.keys(input).filter(
          (key) => input[key] !== responseOfUpdatingUserSetting[0][key],
        ).length,
      };
    });
  }
  /* ============================== Update Operations ============================== */
}
