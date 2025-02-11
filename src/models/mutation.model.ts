import { Field, Int, IntersectionType, ObjectType } from '@nestjs/graphql';
import { AccessTokenDataModel } from './access-token.model';

@ObjectType()
export class AffectedCountModel {
  @Field(() => Int)
  totCount: number;

  @Field(() => Int)
  successCount: number;
}

@ObjectType()
export class AffectedCountOutput extends IntersectionType(
  AffectedCountModel,
  AccessTokenDataModel,
) {}
