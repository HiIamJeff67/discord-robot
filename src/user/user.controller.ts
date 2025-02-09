import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import { AccessTokenData } from '../models';
import { PrivateUserInfo } from './models/user-info.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('updateMyAvatar')
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  @UseInterceptors(FileInterceptor)
  async updateMyAvatar(
    @User() user: ValidateTokenDataInterface,
    @UploadedFile() avatarFile: Express.Multer.File,
  ): Promise<PrivateUserInfo & AccessTokenData> {
    try {
      const res = await this.userService.updateMyAvatar(
        user.id,
        user.userName,
        avatarFile,
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
}
