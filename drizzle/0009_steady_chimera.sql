ALTER TABLE "usersToNotifications" ADD COLUMN "isRead" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "isRead";