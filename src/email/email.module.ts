import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [DrizzleModule, MailerModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
