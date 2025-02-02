import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { CookieModule } from './cookie/cookie.module';
import { AuthModule } from './auth/auth.module';
import { SecureGeneratorModule } from './secret-generator/secret-generator.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SessionModule } from './session/session.module';
import { AccessTokenCacheModule } from './access-token-cache/access-token-cache.module';
import { UserInfoModule } from './user-info/user-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT),
        secure: true,
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, 'email/templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    TrpcModule,
    DrizzleModule,
    CookieModule,
    SecureGeneratorModule,
    AuthModule,
    SessionModule,
    AccessTokenCacheModule,
    UserInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
