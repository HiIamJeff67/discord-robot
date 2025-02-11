DROP INDEX "userInfo_statusIndex";--> statement-breakpoint
ALTER TABLE "userInfo" ADD COLUMN "status" "userStatus" DEFAULT 'Online' NOT NULL;--> statement-breakpoint
CREATE INDEX "userInfo_statusIndex" ON "userInfo" USING btree ("status");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "status";