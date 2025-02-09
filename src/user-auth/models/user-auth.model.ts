import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { IsDate, IsPhoneNumber } from 'class-validator';

@ObjectType()
export class UserAuth {
  @Field(() => String, { nullable: true })
  @IsPhoneNumber('TW')
  phoneNumber?: string | null;

  @Field(() => String, { nullable: true })
  discordId?: string | null;

  @Field(() => String, { nullable: true })
  googleId?: string | null;

  @Field(() => String, { nullable: true })
  spotifyId?: string | null;

  @Field(() => String, { nullable: true })
  twitchId?: string | null;

  @Field(() => String, { nullable: true })
  metaId?: string | null;

  @Field(() => String, { nullable: true })
  redditId?: string | null;

  @Field(() => String, { nullable: true })
  lineId?: string | null;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  updatedAt: Date;
}
