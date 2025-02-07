import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserInfoService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { GetRelativeUserInfosInput } from './dto/get-user.input';
import { UserNotFoundException } from '../exceptions';
import { UserAccount, UserPlan, UserRole } from './models/user-account.model';
import { PaginatedUserInfos, UserInfo } from './models/user-info.model';
import { AccessTokenData } from '../models';
import { UserAuth } from './models/user-auth.model';
import {
  UpdateMyInfoInput,
  UpdateMyPlanInput,
  UpdateMyRoleInput,
} from './dto/update-user.input';
import { DeleteMeInput } from './dto/delete-user.input';

@Resolver('user-info')
export class UserInfoResolver {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Query(() => UserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMe(
    @User() user: ValidateTokenDataInterface,
  ): Promise<UserInfo & AccessTokenData> {
    try {
      const res = await this.userInfoService.getUserInfo(user.id);
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

  @Query(() => PaginatedUserInfos)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getUserInfos(
    @Args('input') input: GetRelativeUserInfosInput,
    @User() user: ValidateTokenDataInterface,
  ): Promise<PaginatedUserInfos & AccessTokenData> {
    try {
      const res = await this.userInfoService.getRelativeUserInfos(input);
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

  @Query(() => UserAuth)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getAuth(
    @User() user: ValidateTokenDataInterface,
  ): Promise<UserAuth & AccessTokenData> {
    try {
      const res = await this.userInfoService.getMyAuth(user.id);
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

  @Query(() => UserAccount)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getAccount(
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

  @Mutation(() => UserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyInfo(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateMyInfoInput,
  ): Promise<UserInfo & AccessTokenData> {
    try {
      const res = await this.userInfoService.updateMyInfo(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UserRole)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyRole(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateMyRoleInput,
  ): Promise<UserRole & AccessTokenData> {
    try {
      const res = await this.userInfoService.updateMyRole(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UserPlan)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyPlan(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateMyPlanInput,
  ): Promise<UserPlan & AccessTokenData> {
    try {
      const res = await this.userInfoService.updateMyPlan(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UserInfo)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async deleteMe(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: DeleteMeInput,
  ): Promise<UserInfo & AccessTokenData> {
    try {
      const res = await this.userInfoService.deleteMe(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }
}
