import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteMeInput {
  @Field()
  password: string;
}
