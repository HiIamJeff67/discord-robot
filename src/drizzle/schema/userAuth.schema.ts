import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserTable } from './user.schema';

export const UserAuthTable = pgTable(
  'userAuth',
  {
    userId: uuid('userId')
      .primaryKey()
      .references(() => UserTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    authCode: text('authCode').notNull(),
    authCodeExpiredAt: timestamp('authCodeExpiredAt').notNull(),
    isEmailAuthenticated: boolean('isEmailAuthenticated')
      .notNull()
      .default(false),
    phoneNumber: text('phoneNumber').unique(),
    discordId: text('discordId').unique(),
    googleId: text('googleId').unique(),
    spotifyId: text('spotifyId').unique(),
    twitchId: text('twitchId').unique(),
    metaId: text('metaId').unique(),
    redditId: text('redditId').unique(),
    lineId: text('lineId').unique(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      phoneNumberIndex: uniqueIndex('userAuth_phoneNumberIndex').on(
        table.phoneNumber,
      ),
      discordIdIndex: uniqueIndex('userAuth_discordIdIndex').on(
        table.discordId,
      ),
      googleIdIndex: uniqueIndex('userAuth_googldIdIndex').on(table.googleId),
      spotifyIdIndex: uniqueIndex('userAuth_spotifyIdIndex').on(
        table.spotifyId,
      ),
      twitchIdIndex: uniqueIndex('userAuth_twitchIdIndex').on(table.twitchId),
      metaIdIndex: uniqueIndex('userAuth_metaIdIndex').on(table.metaId),
      redditIdIndex: uniqueIndex('userAuth_redditIdIndex').on(table.redditId),
      lineIdIndex: uniqueIndex('userAuth_lineIdIndex').on(table.lineId),
    };
  },
);

export const UserAuthRelation = relations(UserAuthTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserAuthTable.userId],
    references: [UserTable.id],
  }),
}));
