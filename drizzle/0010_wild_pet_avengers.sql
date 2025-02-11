DROP INDEX "userInfo_statusIndex";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" "userStatus" DEFAULT 'Online' NOT NULL;--> statement-breakpoint
CREATE INDEX "userInfo_statusIndex" ON "user" USING btree ("status");--> statement-breakpoint
ALTER TABLE "userInfo" DROP COLUMN "status";