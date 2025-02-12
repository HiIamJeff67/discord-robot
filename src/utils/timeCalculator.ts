import {
  ApiISOStringFormException,
  TypeInvalidTimeZoneException,
} from '../exceptions';
import {
  DaysOfWeekNumberType,
  DaysOfWeekType,
  DaysOfWeekTypes,
  TimeZoneType,
  TimeZoneValues,
} from '../types';

export const addSeconds = function (
  second: number,
  initTime: Date = new Date(),
): Date {
  return new Date(initTime.getTime() + second * 1000);
};

export const addMinutes = function (
  minutes: number,
  initTime: Date = new Date(),
): Date {
  return new Date(initTime.getTime() + minutes * 60000);
};

export const addHours = function (
  hours: number,
  initTime: Date = new Date(),
): Date {
  return new Date(initTime.getTime() + hours * 3600000);
};

export const addDays = function (
  days: number,
  initTime: Date = new Date(),
): Date {
  return new Date(initTime.getTime() + days * 86400000);
};

export const ISOStringToDateOnly = function (ISODateString: string): string {
  const datetime = new Date(ISODateString);
  if (isNaN(datetime.getTime())) throw ApiISOStringFormException;
  return datetime.toISOString().split('T')[0];
};

export const ISOStringToTimeOnlyString = function (
  ISODateString: string,
): string {
  const datetime = new Date(ISODateString);
  if (isNaN(datetime.getTime())) throw ApiISOStringFormException;
  return datetime.toISOString().split('T')[1].split('Z')[0];
};

export const daysOfWeekToNumber = function (
  daysOfWeek: DaysOfWeekType,
): DaysOfWeekNumberType {
  switch (daysOfWeek) {
    case 'Monday':
      return 1;
    case 'Tuesday':
      return 2;
    case 'Wednesday':
      return 3;
    case 'Thursday':
      return 4;
    case 'Friday':
      return 5;
    case 'Saturday':
      return 6;
    case 'Sunday':
      return 7;
    default:
      return 1;
  }
};

export const numberToDaysOfWeek = function (
  daysOfWeekNumber: DaysOfWeekNumberType,
): DaysOfWeekType {
  // if (daysOfWeekNumber < 1 || daysOfWeekNumber > 7) daysOfWeekNumber = 1;  // we don't have to check since the type does
  return DaysOfWeekTypes[daysOfWeekNumber - 1];
};

export const IsJwtExpExpired = function (exp: number): boolean {
  return new Date().getTime() / 1000 > exp;
};

/* ============================== Time Zone Calculator ============================== */
export const timeZoneMap: Record<string, string> = {
  'UTC-12:00': 'Etc/GMT+12',
  'UTC-11:00': 'Etc/GMT+11',
  'UTC-10:00': 'Etc/GMT+10',
  'UTC-09:00': 'Etc/GMT+9',
  'UTC-08:00': 'Etc/GMT+8',
  'UTC-07:00': 'Etc/GMT+7',
  'UTC-06:00': 'Etc/GMT+6',
  'UTC-05:00': 'Etc/GMT+5',
  'UTC-04:00': 'Etc/GMT+4',
  'UTC-03:00': 'Etc/GMT+3',
  'UTC-02:00': 'Etc/GMT+2',
  'UTC-01:00': 'Etc/GMT+1',
  'UTC+00:00': 'Etc/GMT',
  'UTC+01:00': 'Etc/GMT-1',
  'UTC+02:00': 'Etc/GMT-2',
  'UTC+03:00': 'Etc/GMT-3',
  'UTC+04:00': 'Etc/GMT-4',
  'UTC+05:00': 'Etc/GMT-5',
  'UTC+06:00': 'Etc/GMT-6',
  'UTC+07:00': 'Etc/GMT-7',
  'UTC+08:00': 'Etc/GMT-8',
  'UTC+09:00': 'Etc/GMT-9',
  'UTC+10:00': 'Etc/GMT-10',
  'UTC+11:00': 'Etc/GMT-11',
  'UTC+12:00': 'Etc/GMT-12',
  'UTC+13:00': 'Pacific/Tongatapu',
  'UTC+14:00': 'Pacific/Kiritimati',
};

export const getTimeZone = function (date: Date = new Date()): TimeZoneType {
  const offsetMinutes = date.getTimezoneOffset();

  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
  const offsetMins = Math.abs(offsetMinutes % 60);

  const sign = offsetMinutes <= 0 ? '+' : '-';
  const hours = offsetHours.toString().padStart(2, '0');
  const mins = offsetMins.toString().padStart(2, '0');

  let timeZoneStr = `UTC${sign}${hours}:${mins}`;

  if (timeZoneStr === 'UTC±00:00') {
    timeZoneStr = 'UTC+00:00';
  }

  const matchedTimeZone = TimeZoneValues.find((tz) => tz === timeZoneStr);
  return (matchedTimeZone ?? `UTC${sign}${hours}:00`) as TimeZoneType;
};

export const getLocalTimeByTimeZone = function (
  date: Date,
  timeZone: string,
): Date {
  const mappedTimeZone = timeZoneMap[timeZone];

  if (!mappedTimeZone) {
    throw TypeInvalidTimeZoneException;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: mappedTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDateStr = formatter.format(date);

  const [month, day, year, hour, minute, second] = formattedDateStr
    .match(/\d+/g)!
    .map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
};

/* ============================== Time Zone Calculator ============================== */
