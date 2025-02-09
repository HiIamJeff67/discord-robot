ALTER TABLE "usersToUsers" RENAME COLUMN "userId1" TO "fromUser";--> statement-breakpoint
ALTER TABLE "usersToUsers" RENAME COLUMN "userId2" TO "toUser";--> statement-breakpoint
ALTER TABLE "usersToUsers" DROP CONSTRAINT "usersToUsers_userId1_user_id_fk";
--> statement-breakpoint
ALTER TABLE "usersToUsers" DROP CONSTRAINT "usersToUsers_userId2_user_id_fk";
--> statement-breakpoint
DROP INDEX "usersToUsers_userId1Index";--> statement-breakpoint
DROP INDEX "usersToUsers_userId2Index";--> statement-breakpoint
ALTER TABLE "usersToUsers" DROP CONSTRAINT "usersToUsers_userId1_userId2_pk";--> statement-breakpoint
ALTER TABLE "usersToUsers" ADD CONSTRAINT "usersToUsers_fromUser_toUser_pk" PRIMARY KEY("fromUser","toUser");--> statement-breakpoint
ALTER TABLE "usersToUsers" ADD CONSTRAINT "usersToUsers_fromUser_user_id_fk" FOREIGN KEY ("fromUser") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "usersToUsers" ADD CONSTRAINT "usersToUsers_toUser_user_id_fk" FOREIGN KEY ("toUser") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "usersToUsers_fromUserIndex" ON "usersToUsers" USING btree ("fromUser");--> statement-breakpoint
CREATE UNIQUE INDEX "usersToUsers_toUserIndex" ON "usersToUsers" USING btree ("toUser");