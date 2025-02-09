import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { GetRelativeUserInfosInput } from './dto/get-user-info.input';
import { UserNotFoundException } from '../exceptions';
import { UserAccount } from './models/user-account.model';
import {
  PaginatedPublicUserInfos,
  PublicUserInfo,
  PrivateUserInfo,
} from './models/user-info.model';
import { AccessTokenData } from '../models';
import {
  UpdateMyInfoInput,
  UpdateMyPlanInput,
  UpdateMyRoleInput,
} from './dto/update-user-info.input';
import { DeleteMeInput } from './dto/delete-user.input';

@Resolver('user')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => PrivateUserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyInfo(
    @User() user: ValidateTokenDataInterface,
  ): Promise<PrivateUserInfo & AccessTokenData> {
    try {
      const res = await this.userService.getPrivateUserInfo(user.id);
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

  @Query(() => PublicUserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getUserInfo(
    @User() user: ValidateTokenDataInterface,
    @Args('userName') userName: string,
  ): Promise<PublicUserInfo & AccessTokenData> {
    try {
      const res = await this.userService.getPublicUserInfo(userName);
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

  @Query(() => PaginatedPublicUserInfos)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getUserInfos(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: GetRelativeUserInfosInput,
  ): Promise<PaginatedPublicUserInfos & AccessTokenData> {
    try {
      const res = await this.userService.getRelativePublicUserInfos(input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => UserAccount)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyAccount(
    @User() user: ValidateTokenDataInterface,
  ): Promise<UserAccount & AccessTokenData> {
    try {
      return {
        userName: user.userName,
        email: user.email,
        role: user.role,
        plan: user.plan,
        userAgent: user.userAgent,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }
  /* ============================== Query Operations ============================== */

  /* ============================== Mutation Operations ============================== */
  @Mutation(() => PrivateUserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyInfo(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateMyInfoInput,
  ): Promise<PrivateUserInfo & AccessTokenData> {
    try {
      const res = await this.userService.updateMyInfo(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UserAccount)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyRole(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateMyRoleInput,
  ): Promise<UserAccount & AccessTokenData> {
    try {
      const res = await this.userService.updateMyRole(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UserAccount)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyPlan(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateMyPlanInput,
  ): Promise<UserAccount & AccessTokenData> {
    try {
      const res = await this.userService.updateMyPlan(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => PrivateUserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async deleteMe(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: DeleteMeInput,
  ): Promise<PrivateUserInfo & AccessTokenData> {
    try {
      const res = await this.userService.deleteMe(user.id, input);
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
