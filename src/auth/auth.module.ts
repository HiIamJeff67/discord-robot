import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CookieModule } from '../cookie/cookie.module';
import { SecureGeneratorModule } from '../secret-generator/secret-generator.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';
import jwtAccessConfig from './configs/jwt-access.config';
import jwtRefreshConfig from './configs/jwt-refresh.config';

@Module({
  imports: [
    DrizzleModule,
    JwtModule.register({}),
    CookieModule,
    SecureGeneratorModule,
    AccessTokenCacheModule,
    ConfigModule.forFeature(jwtAccessConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
  ],
  providers: [AuthResolver, AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
