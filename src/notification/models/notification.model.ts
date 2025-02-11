import {
  Field,
  GraphQLISODateTime,
  IntersectionType,
  ObjectType,
} from '@nestjs/graphql';
import { IsDate, IsIn } from 'class-validator';
import { NotificationEnum } from '../../enums';
import { NotificationType, NotificationValues } from '../../types';
import {
  AccessTokenDataModel,
  AffectedCountModel,
  getPaginatedModel,
} from '../../models';

/* ============================== Type Models ============================== */
@ObjectType()
export class Notification {
  @Field(() => String)
  id: string; // notification id

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => NotificationEnum, { nullable: true })
  @IsIn(NotificationValues)
  type?: NotificationType;

  @Field(() => String, { nullable: true })
  linkId?: string;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  createdAt: Date;
}

@ObjectType()
export class AffectedNotifications extends AffectedCountModel {
  @Field(() => Notification)
  notification: Notification;
}

@ObjectType()
export class PaginatedNotifications extends getPaginatedModel(Notification) {}
/* ============================== Type Models ============================== */

/* ============================== Output Models ============================== */
@ObjectType()
export class NotificationOutput extends IntersectionType(
  Notification,
  AccessTokenDataModel,
) {}

@ObjectType()
export class AffectedNotificationsOutput extends IntersectionType(
  AffectedNotifications,
  AccessTokenDataModel,
) {}

@ObjectType()
export class PaginatedNotificationsOutput extends IntersectionType(
  PaginatedNotifications,
  AccessTokenDataModel,
) {}
/* ============================== Output Models ============================== */
