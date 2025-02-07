import { Field, ObjectType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
import { TokenExpireTimeRegex } from '../regexs';

@ObjectType()
export class AccessTokenData {
  @Field()
  accessToken: string;

  @Field()
  @Matches(TokenExpireTimeRegex)
  expiresIn: string;
}
