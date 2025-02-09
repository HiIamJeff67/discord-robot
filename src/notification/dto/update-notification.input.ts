import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput {
  @Field(() => String)
  notificationId: string;
}
