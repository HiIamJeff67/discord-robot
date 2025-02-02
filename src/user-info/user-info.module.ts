import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { UserInfoRouter } from './user-info.router';

@Module({
  imports: [DrizzleModule],
  providers: [UserInfoService, UserInfoRouter],
})
export class UserInfoModule {}
