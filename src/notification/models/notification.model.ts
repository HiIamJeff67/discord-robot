import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { IsDate, IsIn } from 'class-validator';
import { NotificationEnum } from '../../enums';
import { NotificationType, NotificationValues } from '../../types';
import { Paginated } from '../../models';

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
export class PaginatedNotifications extends Paginated(Notification) {}
