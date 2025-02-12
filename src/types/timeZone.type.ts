import { TimeZoneEnum } from '../enums';

// instead of keys, we will use value as the type
export type TimeZoneType = (typeof TimeZoneEnum)[keyof typeof TimeZoneEnum];

export const TimeZoneValues = Object.values(TimeZoneEnum) as [
  string,
  ...string[],
];
