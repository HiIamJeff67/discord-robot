import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthRouter } from './auth.router';
import { AuthService } from './auth.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { SecureGeneratorModule } from '../secret-generator/secret-generator.module';
import { CookieModule } from '../cookie/cookie.module';
import { SessionModule } from '../session/session.module';
import {
  JwtAuthMiddleware,
  UserPlanMiddleware,
  UserRoleMiddleware,
} from './middlewares';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';

@Module({
  imports: [
    DrizzleModule,
    AccessTokenCacheModule,
    SecureGeneratorModule,
    CookieModule,
    SessionModule,
    JwtModule,
  ],
  providers: [
    AuthService,
    AuthRouter,
    JwtAuthMiddleware,
    UserRoleMiddleware,
    UserPlanMiddleware,
  ],
})
export class AuthModule {}
