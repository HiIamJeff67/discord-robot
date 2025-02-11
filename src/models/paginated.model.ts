import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

interface IEdgeType<T> {
  cursor: string;
  node: T;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function getPaginatedModel<T>(
  classRef: Type<T>,
): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => Int)
    totalCount: number;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPrevPage: boolean;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
