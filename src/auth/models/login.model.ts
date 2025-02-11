import { ObjectType } from '@nestjs/graphql';
import { AccessTokenDataModel } from '../../models';

@ObjectType()
export class DefaultLoginOutput extends AccessTokenDataModel {}
