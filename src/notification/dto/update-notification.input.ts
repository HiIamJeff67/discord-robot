import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsArray } from 'class-validator';

@InputType()
export class UpdateNotificationInput {
  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  notificationIds: string[];
}
