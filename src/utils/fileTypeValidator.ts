import { MimeType } from '../types';

export function isMimeFileTypeIn(
  mimeType: MimeType,
  validMimeTypes: MimeType[],
): boolean {
  for (const validType of validMimeTypes) {
    if (mimeType === validType) return true;
  }
  return false;
}
