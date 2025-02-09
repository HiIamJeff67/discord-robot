import { Module } from '@nestjs/common';
import { UsersToUsersService } from './users-to-users.service';
import { UsersToUsersResolver } from './users-to-users.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [UsersToUsersResolver, UsersToUsersService],
})
export class UsersToUsersModule {}
