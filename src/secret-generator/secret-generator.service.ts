import { Injectable } from '@nestjs/common';
import {
  AccessTokenInterface,
  RefreshTokenInterface,
  TempTokenInterface,
  TokenPayloadInterface,
} from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { alignNumberString } from '../utils';

@Injectable()
export class SecureGeneratorService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(
    payload: TokenPayloadInterface,
  ): Promise<AccessTokenInterface> {
    try {
      const secret = this.configService.get('JWT_SECRET');
      const expiresIn = this.configService.get('JWT_ACCESS_TOKEN_EXPIRED_TIME');

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: expiresIn,
      });

      return {
        accessToken: accessToken,
        expiresIn: expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  async generateRefreshToken(
    payload: TokenPayloadInterface,
  ): Promise<RefreshTokenInterface> {
    try {
      const secret = this.configService.get('JWT_REFRESH_SECRET');
      const expiresIn = this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRED_TIME',
      );

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: expiresIn,
      });

      return {
        refreshToken: refreshToken,
        expiresIn: expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  async generateTempToken(
    payload: TokenPayloadInterface,
  ): Promise<TempTokenInterface> {
    try {
      const secret = this.configService.get('JWT_TEMP_SECRET');
      const expiresIn = this.configService.get('JWT_TEMP_TOKEN_EXPIRED_TIME');

      const tempToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: expiresIn,
      });

      return {
        tempToken: tempToken,
        expiresIn: expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  generateAuthCode(length: number = 6): string {
    return alignNumberString(
      Math.floor(Math.random() * 100000).toString(),
      length,
    );
  }
}
