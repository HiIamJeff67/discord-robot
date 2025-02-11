import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import {
  AffectedNotificationsOutput,
  NotificationOutput,
  PaginatedNotificationsOutput,
} from './models/notification.model';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import {
  GetNotificationInput,
  GetNotificationsInput,
} from './dto/get-notification.input';
import { AffectedCountOutput } from '../models';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { DeleteNotificationInput } from './dto/delete-notification.input';
import { AllowedRoles } from '../auth/decorators/allowed-roles.decorator';
import { UserRoleEnum } from '../enums';
import { UserRolesGuard } from '../auth/guards/user-role.guard';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => NotificationOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyNotification(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: GetNotificationInput,
  ): Promise<NotificationOutput> {
    try {
      const res = await this.notificationService.getOneById(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PaginatedNotificationsOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyNotifications(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: GetNotificationsInput,
  ): Promise<PaginatedNotificationsOutput> {
    try {
      const res = await this.notificationService.getAll(user.id, input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }
  /* ============================== Query Operations ============================== */

  /* ============================== Mutation Operations ============================== */
  @Mutation(() => AffectedNotificationsOutput)
  @AllowedRoles([UserRoleEnum.Developer, UserRoleEnum.Admin]) // probably for devOps
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]), UserRolesGuard)
  async createNofications(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: CreateNotificationInput,
  ): Promise<AffectedNotificationsOutput> {
    try {
      const res = await this.notificationService.createSomeByUserId(input);
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => AffectedCountOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async updateMyNotifications(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: UpdateNotificationInput,
  ): Promise<AffectedCountOutput> {
    try {
      const res = await this.notificationService.updateOneById(user.id, input);

      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => AffectedCountOutput)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async deleteMyNotifications(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: DeleteNotificationInput,
  ): Promise<AffectedCountOutput> {
    try {
      const res = await this.notificationService.deleteSomeById(user.id, input);

      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }
  /* ============================== Mutation Operations ============================== */
}
