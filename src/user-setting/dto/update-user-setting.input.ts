import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserSettingInput } from './create-user-setting.input';

@InputType()
export class UpdateUserSettingInput extends PartialType(
  CreateUserSettingInput,
) {}
