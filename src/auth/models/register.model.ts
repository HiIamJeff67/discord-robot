import { ObjectType } from '@nestjs/graphql';
import { AccessTokenDataModel } from '../../models';

@ObjectType()
export class DefaultRegisterOutput extends AccessTokenDataModel {}
