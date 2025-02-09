import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import {
  Notification,
  PaginatedNotifications,
} from './models/notification.model';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard, JwtAnyGuard, JwtRefreshGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { ValidateTokenDataInterface } from '../interfaces';
import {
  GetNotificationInput,
  GetNotificationsInput,
} from './dto/get-notification.input';
import { AccessTokenData } from '../models';
import { PubSub } from 'graphql-subscriptions';
import { getNotificationSubscriptionChannelName } from '../utils';

// initial publish subscription here, so it will not re-create one for every user
const pubSub = new PubSub();

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  /* ============================== Query Operations ============================== */
  @Query(() => Notification)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyNotification(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: GetNotificationInput,
  ): Promise<Notification & AccessTokenData> {
    try {
      const res = await this.notificationService.getMyNotification(
        user.id,
        input,
      );
      return {
        ...res,
        accessToken: user.accessTokenData.accessToken,
        expiresIn: user.accessTokenData.expiresIn,
      };
    } catch (error) {
      throw error;
    }
  }

  @Query(() => PaginatedNotifications)
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  async getMyNotifications(
    @User() user: ValidateTokenDataInterface,
    @Args('input') input: GetNotificationsInput,
  ): Promise<PaginatedNotifications & AccessTokenData> {
    try {
      const res = await this.notificationService.getMyNotifications(
        user.id,
        input,
      );
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

  /* ============================== Mutation Operations ============================== */

  /* ============================== Subscription Operations ============================== */
  @Subscription(() => String, {
    filter: (payload, variable) => payload.receiverId === variable.user.id,
  })
  @UseGuards(JwtAnyGuard([JwtAccessGuard, JwtRefreshGuard]))
  registerNotificationSubscription(@User() user: ValidateTokenDataInterface) {
    return pubSub.asyncIterableIterator(
      getNotificationSubscriptionChannelName(user.id),
    );
  }
  /* ============================== Subscription Operations ============================== */
}
