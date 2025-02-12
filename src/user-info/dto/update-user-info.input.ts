import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInfoInput } from './create-user-info.input';

@InputType()
export class UpdateUserInfoInput extends PartialType(CreateUserInfoInput) {}
