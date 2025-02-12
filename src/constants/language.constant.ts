import { LanguageType } from '../types';

export const GeoIPCountryToSupportedLanguageMap: Record<string, LanguageType> =
  {
    TW: 'TraditionalChinese',
    HK: 'TraditionalChinese',
    MO: 'TraditionalChinese',
    CN: 'SimplifiedChinese',
    SG: 'SimplifiedChinese',
    JP: 'Japanese',
    // since default will be english, no need to map US, UK, etc.
    //   US: 'English',
    //   UK: 'English',
  };

export const AcceptLanguageToSupportedLanguageMap: Record<
  string,
  LanguageType
> = {
  'zh-TW': 'TraditionalChinese',
  'zh-HK': 'TraditionalChinese',
  'zh-MO': 'TraditionalChinese',
  'zh-CN': 'SimplifiedChinese',
  'zh-SG': 'SimplifiedChinese',
  ja: 'Japanese',
};
