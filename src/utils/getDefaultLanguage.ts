import { Request } from 'express';
import { LanguageType } from '../types';
import {
  AcceptLanguageToSupportedLanguageMap,
  GeoIPCountryToSupportedLanguageMap,
} from '../constants';
import { IncomingHttpHeaders } from 'http2';
import geoip from 'geoip-lite';

export const getDefaultLanguageFromRequest = function (
  request: Request,
): LanguageType | null {
  const acceptLanguage = request.headers['accept-language'];
  if (!acceptLanguage) return null;

  const preferred = acceptLanguage.split(',')[0];
  return AcceptLanguageToSupportedLanguageMap[preferred] ?? null;
};

export const getDefaultLanguageFromHeaders = function (
  headers: IncomingHttpHeaders,
): LanguageType | null {
  const acceptLanguage = headers['accept-language'];
  if (!acceptLanguage) return null;

  const perferred = acceptLanguage.split(',')[0];
  return AcceptLanguageToSupportedLanguageMap[perferred] ?? null;
};

export const getDefaultLanguageFromAcceptLanguage = function (
  acceptLanguage: string,
) {
  const perferred = acceptLanguage.split(',')[0];
  return AcceptLanguageToSupportedLanguageMap[perferred] ?? null;
};

export const getDefaultLanguageFromIP = function (
  ip: string,
): LanguageType | null {
  const geo = geoip.lookup(ip);
  if (!geo) return null;
  return GeoIPCountryToSupportedLanguageMap[geo.country] ?? null;
};
