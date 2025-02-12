CREATE TYPE "public"."languageEnum" AS ENUM('English', 'Japanese', 'TraditionalChinese', 'SimplifiedChinese');--> statement-breakpoint
CREATE TYPE "public"."notificationTypeEnum" AS ENUM('System', 'Security', 'AD', 'FriendRequest');--> statement-breakpoint
CREATE TYPE "public"."themeEnum" AS ENUM('Dark', 'Light', 'System');--> statement-breakpoint
CREATE TYPE "public"."timeZoneEnum" AS ENUM('UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00', 'UTC+13:00', 'UTC+14:00');--> statement-breakpoint
CREATE TYPE "public"."userGenderEnum" AS ENUM('Male', 'Female', 'PreferNotToSay');--> statement-breakpoint
CREATE TYPE "public"."userPlanEnum" AS ENUM('Free', 'Pro', 'Ultimate', 'Enterprise');--> statement-breakpoint
CREATE TYPE "public"."userRoleEnum" AS ENUM('NonCertified', 'Certified', 'AlphaExplorer', 'BetaExplorer', 'GammaExplorer', 'Developer', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."userStatusEnum" AS ENUM('Online', 'Offline', 'AFK', 'DoNotDisturb');--> statement-breakpoint
CREATE TYPE "public"."usersToUsersStatusEnum" AS ENUM('Pending', 'Friend', 'BestFriend', 'Blocked');--> statement-breakpoint
CREATE TABLE "userSetting" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"language" "languageEnum" DEFAULT 'English' NOT NULL,
	"theme" "themeEnum" DEFAULT 'Dark' NOT NULL,
	"timeZone" "timeZoneEnum" DEFAULT 'UTC+00:00' NOT NULL,
	"generalSettingsCode" integer DEFAULT 0 NOT NULL,
	"privacySettingsCode" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userAuth" DROP CONSTRAINT "userAuth_userId_unique";--> statement-breakpoint
ALTER TABLE "userAuth" DROP CONSTRAINT "userAuth_userId_user_id_fk";
--> statement-breakpoint

ALTER TABLE "notification" ALTER COLUMN "type" SET DATA TYPE "notificationTypeEnum" USING "type"::text::"notificationTypeEnum";

ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "userRoleEnum" USING "role"::text::"userRoleEnum";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'NonCertified';--> statement-breakpoint

ALTER TABLE "user" ALTER COLUMN "plan" DROP DEFAULT--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "plan" SET DATA TYPE "userPlanEnum" USING "plan"::text::"userPlanEnum";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "plan" SET DEFAULT 'Free'--> statement-breakpoint

ALTER TABLE "userAuth" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "userAuth" ADD PRIMARY KEY ("userId");--> statement-breakpoint

ALTER TABLE "userInfo" ALTER COLUMN "status" DROP DEFAULT--> statement-breakpoint
ALTER TABLE "userInfo" ALTER COLUMN "status" SET DATA TYPE "userStatusEnum" USING "status"::text::"userStatusEnum";--> statement-breakpoint
ALTER TABLE "userInfo" ALTER COLUMN "status" SET DEFAULT 'Offline';--> statement-breakpoint

ALTER TABLE "userInfo" ALTER COLUMN "gender" DROP DEFAULT--> statement-breakpoint
ALTER TABLE "userInfo" ALTER COLUMN "gender" SET DATA TYPE "userGenderEnum" USING "gender"::text::"userGenderEnum";--> statement-breakpoint
ALTER TABLE "userInfo" ALTER COLUMN "gender" SET DEFAULT 'PreferNotToSay'--> statement-breakpoint

ALTER TABLE "usersToUsers" ALTER COLUMN "status" SET DATA TYPE "usersToUsersStatusEnum" USING "status"::text::"usersToUsersStatusEnum";--> statement-breakpoint

ALTER TABLE "userAuth" ADD COLUMN "isEmailAuthenticated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "userSetting" ADD CONSTRAINT "userSetting_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "userSetting_timeZoneIndex" ON "userSetting" USING btree ("timeZone");--> statement-breakpoint
ALTER TABLE "userAuth" ADD CONSTRAINT "userAuth_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
DROP TYPE "public"."notificationType";--> statement-breakpoint
DROP TYPE "public"."userGender";--> statement-breakpoint
DROP TYPE "public"."userPlan";--> statement-breakpoint
DROP TYPE "public"."userRole";--> statement-breakpoint
DROP TYPE "public"."userStatus";--> statement-breakpoint
DROP TYPE "public"."usersToUsersStatus";