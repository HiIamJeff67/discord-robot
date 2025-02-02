import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';

@Injectable({})
export class UserInfoService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getMe() {}

  async getMyInfo() {}

  async getMyAccount() {}

  async getUsers() {}

  async getUserInfo() {}

  async updateMyInfo() {}

  async deleteMe() {}
}
