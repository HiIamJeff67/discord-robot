import { Field, InputType, Int } from '@nestjs/graphql';
import { DefaultAfterValueForSearch } from '../../constants';

@InputType()
export class GetNotificationInput {
  @Field(() => String)
  notificationId: string;
}

@InputType()
export class GetNotificationsInput {
  @Field(() => Int, { defaultValue: 10 })
  first: number;

  @Field(() => String, { defaultValue: DefaultAfterValueForSearch })
  after: string;

  @Field(() => Int, { nullable: true })
  totCount?: number;
}
