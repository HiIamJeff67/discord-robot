ALTER TYPE "public"."userRole" ADD VALUE 'Developer' BEFORE 'Admin';--> statement-breakpoint
ALTER TABLE "userToken" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "userToken" CASCADE;--> statement-breakpoint
DROP INDEX "user_displayNameIndex";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "refreshToken" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "userAgent" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userInfo" ADD COLUMN "displayName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userInfo" ADD COLUMN "avatarURL" text;--> statement-breakpoint
CREATE INDEX "user_userAgentIndex" ON "user" USING btree ("userAgent");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "displayName";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "avatarURL";