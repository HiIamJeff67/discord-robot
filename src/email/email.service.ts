import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import {
  AuthCodeEmailPayloadInterface,
  ReportEmailPayloadInterface,
  WelcomeEmailPayloadInterface,
} from '../interfaces/email.interface';
import { toUTCPlusN } from '../utils';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  private currentYear = toUTCPlusN(
    new Date(),
    Number(this.configService.get('DEFAULT_TIME_ZONE_OFFSET')),
  ).getFullYear();

  /* ================================= Send Welcome Email operations ================================= */
  async sendWelcomeEmail(to: string, payload: WelcomeEmailPayloadInterface) {
    return await this.mailerService.sendMail({
      to: to,
      subject: 'Thanks for joining us',
      template: './welcomeEmail',
      context: {
        ...payload,
        ApplicationIconUrl: '',
        from: '',
        currentYear: this.currentYear,
      },
    });
  }
  /* ================================= Send Welcome Email operations ================================= */

  /* ================================= Send AuthCode(Validation) Email operations ================================= */
  async sendAuthCodeEmail(to: string, payload: AuthCodeEmailPayloadInterface) {}
  /* ================================= Send AuthCode(Validation) Email operations ================================= */

  /* ================================= Send Report(Feedback) Email operations ================================= */
  async sendReportEmailToDeveloper(
    to: string,
    payload: ReportEmailPayloadInterface,
  ) {}
  /* ================================= Send Report(Feedback) Email operations ================================= */
}
