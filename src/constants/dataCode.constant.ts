import { PrivacySettingsCodeInterface } from '../interfaces';
import { PrivacySettingsType } from '../types';

export const PrivacySettingsCodeMap: Record<PrivacySettingsType, number> =
  Object.fromEntries(
    Object.keys({} as PrivacySettingsCodeInterface).map((key, index) => [
      key,
      index,
    ]),
  ) as Record<PrivacySettingsType, number>;
