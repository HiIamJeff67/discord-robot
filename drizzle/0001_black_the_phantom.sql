CREATE UNIQUE INDEX "userInfo_userNameIndex" ON "userInfo" USING btree ("userName");--> statement-breakpoint
CREATE INDEX "userInfo_displayNameIndex" ON "userInfo" USING btree ("displayName");--> statement-breakpoint
CREATE UNIQUE INDEX "userInfo_inviteCodeIndex" ON "userInfo" USING btree ("inviteCode");