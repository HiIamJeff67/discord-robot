import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { SecureGeneratorModule } from '../secret-generator/secret-generator.module';
import { CookieModule } from '../cookie/cookie.module';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';

@Module({
  imports: [
    DrizzleModule,
    SecureGeneratorModule,
    CookieModule,
    AccessTokenCacheModule,
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
