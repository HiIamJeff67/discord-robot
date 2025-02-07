import { ObjectType } from '@nestjs/graphql';
import { AccessTokenData } from '../../models';

@ObjectType()
export class DefaultLoginOutput extends AccessTokenData {}
