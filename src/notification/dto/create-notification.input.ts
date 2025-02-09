import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn } from 'class-validator';
import { NotificationEnum } from '../../enums';
import { NotificationType, NotificationValues } from '../../types';

@InputType()
export class CreateNotificationInput {
  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  to: string[];

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => NotificationEnum, { nullable: true })
  @IsIn(NotificationValues)
  type?: NotificationType;

  @Field(() => String, { nullable: true })
  linkId?: string;
}
