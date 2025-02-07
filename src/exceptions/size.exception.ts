import { NotAcceptableException } from '@nestjs/common';

export const MaxAvatarFileSizeException = new NotAcceptableException({
  case: 'E-Size-001',
  message: 'The size of the given avatar exceeded',
});
