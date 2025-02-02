import {
  MinUserNameLength,
  MaxUserNameLength,
  MinDisplayNameLength,
  MaxDisplayNameLength,
  MinPasswordLength,
} from '../constants';
import { NotAcceptableException } from '@nestjs/common';

export const TypeUserNameFormException = new NotAcceptableException({
  case: 'E-F-001-01',
  message: 'Username must consist of only english letters and numbers.',
});

export const TypeUserNameLengthException = new NotAcceptableException({
  case: 'E-F-001-02',
  message: `Username must be shorter than or equal to ${MaxUserNameLength}, and greater than or equal to ${MinUserNameLength}.`,
});

export const TypeDisplayNameFormException = new NotAcceptableException({
  case: 'E-F-002-01',
  message: 'Displayname must consist of only english letters and numbers.',
});

export const TypeDisplayNameLengthException = new NotAcceptableException({
  case: 'E-F-002-02',
  message: `Displayname must be shorter than or equal to ${MaxDisplayNameLength}, and greater than or equal to ${MinDisplayNameLength}.`,
});

export const TypeEmailFormException = new NotAcceptableException({
  case: 'E-F-003-01',
  message: 'Email must be the form for example my_email@email.com.',
});

export const TypePasswordFormException = new NotAcceptableException({
  case: 'E-F-004-01',
  message:
    'Password must consist of lowercase english letters and uppercase english letters and numbers, and at least one symbol.',
});

export const TypePasswordLengthException = new NotAcceptableException({
  case: 'E-F-004-02',
  message: `Password must be shorter than or equal to ${MinPasswordLength}.`,
});
