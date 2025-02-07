import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { tokenFormStringToNumberSecond } from '../utils';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  storeRefreshTokenCookie(refreshToken: string, response: any): any {
    const isProduction =
      this.configService.get('NODE_ENVIRONMENT') === 'production';
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge:
        tokenFormStringToNumberSecond(
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRED_TIME') as string,
        ) * 1000,
    });

    return response;
  }

  loadRefreshTokenCookie(request: Request): {
    refreshToken: string | undefined;
  } {
    return { refreshToken: request.cookies['refreshToken'] };
  }

  clearRefreshTokenCookie(response: Response): Response {
    response.clearCookie('refreshToken');
    return response;
  }
}
