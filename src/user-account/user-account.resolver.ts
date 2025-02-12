import { UserAccountService } from './user-account.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { UserAccountOutput } from './models/user-account.model';
import { AffectedCountOutput } from '../models';
import { UpdateAccountInput } from './dto/update-user-account.input';

@Resolver('user-account')
export class UserAccountResolver {
  constructor(private readonly userAccountService: UserAccountService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => UserAccountOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyAccount(
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
  @Mutation(() => AffectedCountOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyAccount(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateAccountInput,
  ): Promise<AffectedCountOutput> {
    try {
      const res = await this.userAccountService.updateOneByUserId(
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
