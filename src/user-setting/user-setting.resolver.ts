import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSettingService } from './user-setting.service';
import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import {
  AffectedUserSettingOutput,
  UserSettingOutput,
} from './models/user-setting.model';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { UpdateUserSettingInput } from './dto/update-user-setting.input';

@Resolver()
export class UserSettingResolver {
  constructor(private readonly userSettingService: UserSettingService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => UserSettingOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMySetting(
    @User() user: ValidateTokenDataInterface,
  ): Promise<UserSettingOutput> {
    try {
      const res = await this.userSettingService.getOneByUserId(user.id);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }
  /* ============================== Query Operations ============================== */

  /* ============================== Mutation Operations ============================== */
  @Mutation(() => AffectedUserSettingOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMySetting(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateUserSettingInput,
  ): Promise<AffectedUserSettingOutput> {
    try {
      const res = await this.userSettingService.updateOneByUserId(
        user.id,
        user.accessTokenData,
        input,
      );
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }
  /* ============================== Mutation Operations ============================== */
}
