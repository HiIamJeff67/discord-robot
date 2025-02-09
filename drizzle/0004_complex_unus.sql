ALTER TABLE "friendRequest" RENAME TO "friendRequests";--> statement-breakpoint
ALTER TABLE "friendRequests" DROP CONSTRAINT "friendRequest_fromUser_user_id_fk";
--> statement-breakpoint
ALTER TABLE "friendRequests" DROP CONSTRAINT "friendRequest_toUser_user_id_fk";
--> statement-breakpoint
DROP INDEX "friendRequest_fromIndex";--> statement-breakpoint
DROP INDEX "friendRequest_toIndex";--> statement-breakpoint
ALTER TABLE "friendRequests" DROP CONSTRAINT "friendRequest_fromUser_toUser_pk";--> statement-breakpoint
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_fromUser_toUser_pk" PRIMARY KEY("fromUser","toUser");--> statement-breakpoint
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_fromUser_user_id_fk" FOREIGN KEY ("fromUser") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_toUser_user_id_fk" FOREIGN KEY ("toUser") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "friendRequests_fromIndex" ON "friendRequests" USING btree ("fromUser");--> statement-breakpoint
CREATE UNIQUE INDEX "friendRequests_toIndex" ON "friendRequests" USING btree ("toUser");