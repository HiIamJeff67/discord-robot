DROP INDEX "userInfo_planIndex";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan" "userPlan" DEFAULT 'Free' NOT NULL;--> statement-breakpoint
CREATE INDEX "user_planIndex" ON "user" USING btree ("plan");--> statement-breakpoint
ALTER TABLE "userInfo" DROP COLUMN "plan";