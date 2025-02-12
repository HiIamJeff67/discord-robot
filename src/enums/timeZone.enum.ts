import { registerEnumType } from '@nestjs/graphql';

export const TimeZoneEnum = {
  UTC_MINUS_12: 'UTC-12:00',
  UTC_MINUS_11: 'UTC-11:00',
  UTC_MINUS_10: 'UTC-10:00',
  UTC_MINUS_09: 'UTC-09:00',
  UTC_MINUS_08: 'UTC-08:00',
  UTC_MINUS_07: 'UTC-07:00',
  UTC_MINUS_06: 'UTC-06:00',
  UTC_MINUS_05: 'UTC-05:00',
  UTC_MINUS_04: 'UTC-04:00',
  UTC_MINUS_03: 'UTC-03:00',
  UTC_MINUS_02: 'UTC-02:00',
  UTC_MINUS_01: 'UTC-01:00',
  UTC_ZERO: 'UTC+00:00',
  UTC_PLUS_01: 'UTC+01:00',
  UTC_PLUS_02: 'UTC+02:00',
  UTC_PLUS_03: 'UTC+03:00',
  UTC_PLUS_04: 'UTC+04:00',
  UTC_PLUS_05: 'UTC+05:00',
  UTC_PLUS_06: 'UTC+06:00',
  UTC_PLUS_07: 'UTC+07:00',
  UTC_PLUS_08: 'UTC+08:00',
  UTC_PLUS_09: 'UTC+09:00',
  UTC_PLUS_10: 'UTC+10:00',
  UTC_PLUS_11: 'UTC+11:00',
  UTC_PLUS_12: 'UTC+12:00',
  UTC_PLUS_13: 'UTC+13:00',
  UTC_PLUS_14: 'UTC+14:00',
} as const;

registerEnumType(TimeZoneEnum, {
  name: 'TimeZoneEnum',
});
