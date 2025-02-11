import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { GetRelativeUserInfosInput } from './dto/get-user-info.input';
import { UserNotFoundException } from '../exceptions';
import { UserAccountOutput } from './models/user-account.model';
import {
  PrivateUserInfoOutput,
  PublicUserInfoOutput,
  PaginatedPublicUserInfosOutput,
  AffectedPrivateUserInfoOutput,
} from './models/user-info.model';
import { AffectedCountOutput } from '../models';
import {
  UpdateAccountInput,
  UpdateInfoInput,
} from './dto/update-user-info.input';
import { DeleteAccountInput } from './dto/delete-user.input';

@Resolver('user')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => PrivateUserInfoOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyInfo(
    @User() user: ValidateTokenDataInterface,
  ): Promise<PrivateUserInfoOutput> {
    try {
      const res = await this.userService.getMe(user.id);
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
      const res = await this.userService.getOneById(userName);
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
      const res = await this.userService.getAllRelative(input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => UserAccountOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async findMyAccount(
    @User() user: ValidateTokenDataInterface,
  ): Promise<UserAccountOutput> {
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
  @Mutation(() => AffectedPrivateUserInfoOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyInfo(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateInfoInput,
  ): Promise<AffectedPrivateUserInfoOutput> {
    try {
      const res = await this.userService.updateInfoById(user.id, input);
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
  async updateMyAccount(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateAccountInput,
  ): Promise<AffectedCountOutput> {
    try {
      const res = await this.userService.updateAccountById(user.id, input);
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
      const res = await this.userService.deleteOneById(user.id, input);
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
