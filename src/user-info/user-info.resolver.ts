import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserInfoService } from './user-info.service';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { GetRelativeUserInfosInput } from './dto/get-user-info.input';
import { UserNotFoundException } from '../exceptions';
import {
  PrivateUserInfoOutput,
  PublicUserInfoOutput,
  PaginatedPublicUserInfosOutput,
  AffectedPrivateUserInfoOutput,
} from './models/user-info.model';
import { AffectedCountOutput } from '../models';
import { UpdateUserInfoInput } from './dto/update-user-info.input';
import { DeleteAccountInput } from './dto/delete-user-info.input';

@Resolver()
export class UserInfoResolver {
  constructor(private readonly userInfoService: UserInfoService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => PrivateUserInfoOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyInfo(
    @User() user: ValidateTokenDataInterface,
  ): Promise<PrivateUserInfoOutput> {
    try {
      const res = await this.userInfoService.getOneByUserId(user.id);
      if (!res) throw UserNotFoundException;
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PublicUserInfoOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getUserInfo(
    @User() user: ValidateTokenDataInterface,
    @Args('userName') userName: string,
  ): Promise<PublicUserInfoOutput> {
    try {
      const res = await this.userInfoService.getOneByUserName(userName);
      if (!res) throw UserNotFoundException;
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PaginatedPublicUserInfosOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getUserInfos(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: GetRelativeUserInfosInput,
  ): Promise<PaginatedPublicUserInfosOutput> {
    try {
      const res = await this.userInfoService.getAllRelative(input);
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
  @Mutation(() => AffectedPrivateUserInfoOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyInfo(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateUserInfoInput,
  ): Promise<AffectedPrivateUserInfoOutput> {
    try {
      const res = await this.userInfoService.updateInfoByUserId(
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

  @Mutation(() => AffectedCountOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async deleteMyAccount(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: DeleteAccountInput,
  ): Promise<AffectedCountOutput> {
    try {
      const res = await this.userInfoService.deleteOneByUserId(user.id, input);
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
