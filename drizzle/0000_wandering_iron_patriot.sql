CREATE TYPE "public"."notificationType" AS ENUM('System', 'Security', 'AD');--> statement-breakpoint
CREATE TYPE "public"."userGender" AS ENUM('Male', 'Female', 'PreferNotToSay');--> statement-breakpoint
CREATE TYPE "public"."userPlan" AS ENUM('Free', 'Pro', 'Ultimate', 'Enterprise');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('NonCertified', 'Certified', 'AlphaExplorer', 'BetaExplorer', 'GammaExplorer', 'Developer', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."userStatus" AS ENUM('Online', 'Offline', 'AFK', 'DoNotDisturb');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" "notificationType",
	"link" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userName" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "userRole" DEFAULT 'NonCertified' NOT NULL,
	"plan" "userPlan" DEFAULT 'Free' NOT NULL,
	"refreshToken" text NOT NULL,
	"userAgent" text NOT NULL,
	CONSTRAINT "user_userName_unique" UNIQUE("userName"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "userAuth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"authCode" text NOT NULL,
	"authCodeExpiredAt" timestamp NOT NULL,
	"phoneNumber" text,
	"discordId" text,
	"googleId" text,
	"spotifyId" text,
	"twitchId" text,
	"metaId" text,
	"redditId" text,
	"lineId" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userAuth_userId_unique" UNIQUE("userId"),
	CONSTRAINT "userAuth_phoneNumber_unique" UNIQUE("phoneNumber"),
	CONSTRAINT "userAuth_discordId_unique" UNIQUE("discordId"),
	CONSTRAINT "userAuth_googleId_unique" UNIQUE("googleId"),
	CONSTRAINT "userAuth_spotifyId_unique" UNIQUE("spotifyId"),
	CONSTRAINT "userAuth_twitchId_unique" UNIQUE("twitchId"),
	CONSTRAINT "userAuth_metaId_unique" UNIQUE("metaId"),
	CONSTRAINT "userAuth_redditId_unique" UNIQUE("redditId"),
	CONSTRAINT "userAuth_lineId_unique" UNIQUE("lineId")
);
--> statement-breakpoint
CREATE TABLE "userInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"userName" text NOT NULL,
	"displayName" text NOT NULL,
	"inviteCode" serial NOT NULL,
	"avatarURL" text,
	"status" "userStatus" DEFAULT 'Online' NOT NULL,
	"gender" "userGender" DEFAULT 'PreferNotToSay' NOT NULL,
	"birthDate" timestamp,
	"selfIntroduction" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userInfo_userId_unique" UNIQUE("userId"),
	CONSTRAINT "userInfo_userName_unique" UNIQUE("userName"),
	CONSTRAINT "userInfo_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE "usersToNotifications" (
	"userId" uuid NOT NULL,
	"notificationId" uuid NOT NULL,
	CONSTRAINT "usersToNotifications_userId_notificationId_pk" PRIMARY KEY("userId","notificationId")
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_creatorId_user_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userAuth" ADD CONSTRAINT "userAuth_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_userName_user_userName_fk" FOREIGN KEY ("userName") REFERENCES "public"."user"("userName") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "usersToNotifications" ADD CONSTRAINT "usersToNotifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersToNotifications" ADD CONSTRAINT "usersToNotifications_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "notification_creatorIdIndex" ON "notification" USING btree ("creatorId");--> statement-breakpoint
CREATE INDEX "notification_titleIndex" ON "notification" USING btree ("title");--> statement-breakpoint
CREATE INDEX "notification_contentIndex" ON "notification" USING btree ("content");--> statement-breakpoint
CREATE INDEX "notification_typeIndex" ON "notification" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notification_updatedAtIndex" ON "notification" USING btree ("updatedAt");--> statement-breakpoint
CREATE INDEX "notification_createdAtIndex" ON "notification" USING btree ("createdAt");--> statement-breakpoint
CREATE UNIQUE INDEX "user_userNameIndex" ON "user" USING btree ("userName");--> statement-breakpoint
CREATE UNIQUE INDEX "user_emailIndex" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_roleIndex" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_planIndex" ON "user" USING btree ("plan");--> statement-breakpoint
CREATE INDEX "user_userAgentIndex" ON "user" USING btree ("userAgent");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_phoneNumberIndex" ON "userAuth" USING btree ("phoneNumber");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_discordIdIndex" ON "userAuth" USING btree ("discordId");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_googldIdIndex" ON "userAuth" USING btree ("googleId");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_spotifyIdIndex" ON "userAuth" USING btree ("spotifyId");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_twitchIdIndex" ON "userAuth" USING btree ("twitchId");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_metaIdIndex" ON "userAuth" USING btree ("metaId");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_redditIdIndex" ON "userAuth" USING btree ("redditId");--> statement-breakpoint
CREATE UNIQUE INDEX "userAuth_lineIdIndex" ON "userAuth" USING btree ("lineId");--> statement-breakpoint
CREATE UNIQUE INDEX "userInfo_userIdIndex" ON "userInfo" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "userInfo_birthDateIndex" ON "userInfo" USING btree ("birthDate");--> statement-breakpoint
CREATE INDEX "userInfo_statusIndex" ON "userInfo" USING btree ("status");--> statement-breakpoint
CREATE INDEX "userInfo_updatedAtIndex" ON "userInfo" USING btree ("updatedAt");--> statement-breakpoint
CREATE INDEX "userInfo_createdAtIndex" ON "userInfo" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "usersToNotifications_userIdIndex" ON "usersToNotifications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "usersToNotifications_notificationIdIndex" ON "usersToNotifications" USING btree ("notificationId");