import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsStrongPassword } from 'class-validator';

@InputType()
export class DefaultLoginInput {
  @Field()
  account: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
