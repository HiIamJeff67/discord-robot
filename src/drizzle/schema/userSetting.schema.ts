import { index, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { LanguagePgEnum, ThemePgEnum, TimeZonePgEnum } from './enum.schema';
import { UserTable } from './user.schema';
import { LanguageEnum, ThemeEnum, TimeZoneEnum } from '../../enums';
import { relations } from 'drizzle-orm';

export const UserSettingTable = pgTable(
  'userSetting',
  {
    userId: uuid('userId')
      .primaryKey()
      .references(() => UserTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    language: LanguagePgEnum('language')
      .notNull()
      .default(LanguageEnum.English),
    theme: ThemePgEnum('theme').notNull().default(ThemeEnum.Dark),
    timeZone: TimeZonePgEnum('timeZone')
      .notNull()
      .default(TimeZoneEnum.UTC_ZERO),
    generalSettingsCode: integer('generalSettingsCode').notNull().default(0), // up to 16 bits
    privacySettingsCode: integer('privacySettingsCode').notNull().default(0), // up to 16 bits
  },
  (table) => {
    return {
      timeZoneIndex: index('userSetting_timeZoneIndex').on(table.timeZone),
    };
  },
);

export const UserSettingRelation = relations(UserSettingTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserSettingTable.userId],
    references: [UserTable.id],
  }),
}));
