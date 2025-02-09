import { Query, Resolver } from '@nestjs/graphql';
import { UserAuthService } from './user-auth.service';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { UserAuth } from './models/user-auth.model';
import { UseGuards } from '@nestjs/common';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { AccessTokenData } from 'token';

@Resolver('user-auth')
export class UserAuthResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Query(() => UserAuth)
  @UseGuards(JwtAnyGuard, JwtAccessGuard, JwtRefreshGuard)
  async getMyAuth(
    @User() user: ValidateTokenDataInterface,
  ): Promise<UserAuth & AccessTokenData> {
    try {
      const res = await this.userAuthService.getMyAuth(user.id);
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
