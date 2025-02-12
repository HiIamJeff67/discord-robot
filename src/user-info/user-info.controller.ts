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
import { AffectedCountOutput } from '../models';
import { UserInfoService } from './user-info.service';

@Controller('user')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Post('updateMyAvatar')
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  @UseInterceptors(FileInterceptor)
  async updateMyAvatar(
    @User() user: ValidateTokenDataInterface,
    @UploadedFile() avatarFile: Express.Multer.File,
  ): Promise<AffectedCountOutput> {
    try {
      const res = await this.userInfoService.updateAvatarByUserId(
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
