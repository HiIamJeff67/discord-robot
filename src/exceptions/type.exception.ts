import { NotAcceptableException } from '@nestjs/common';
import { MimeType } from '../types';

export const TypeUserNameFormException = new NotAcceptableException({
  case: 'E-F-001',
  message: 'Username must consist of only english letters and numbers.',
});

export const TypeDisplayNameFormException = new NotAcceptableException({
  case: 'E-Type-002',
  message: 'Displayname must consist of only english letters and numbers.',
});

export const TypeEmailFormException = new NotAcceptableException({
  case: 'E-Type-003',
  message: 'Email must be the form for example my_email@email.com.',
});

export const TypePasswordFormException = new NotAcceptableException({
  case: 'E-Type-004',
  message:
    'Password must consist of lowercase english letters and uppercase english letters and numbers, and at least one symbol.',
});

export const TypeInviteCodeFormException = new NotAcceptableException({
  case: 'E-Type-005',
  message: 'Invite code must be integer',
});

export const TypeTokenExpiredTimeFormException = new NotAcceptableException({
  case: 'E-Type-006',
  message: 'The form of the expiresIn column is invalid',
});

export const TypeInvalidMimeTypeException = (
  mimeType: MimeType,
  validMimeTypes: MimeType[],
) =>
  new NotAcceptableException({
    case: 'E-Type-007',
    message: `The given mime type ${mimeType} is invalid, valid mime types: ${validMimeTypes}`,
  });

export const TypeInvalidTimeZoneException = new NotAcceptableException({
  case: 'E-Type-008',
  message: 'The given time zone is invalid',
});
