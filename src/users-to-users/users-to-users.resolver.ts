import { Resolver } from '@nestjs/graphql';
import { UsersToUsersService } from './users-to-users.service';

@Resolver()
export class UsersToUsersResolver {
  constructor(private readonly usersToUsersService: UsersToUsersService) {}
}
