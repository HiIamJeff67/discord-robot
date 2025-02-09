CREATE TYPE "public"."friendRequestFrom" AS ENUM('User1', 'User2');--> statement-breakpoint
CREATE TYPE "public"."usersToUsersStatus" AS ENUM('Friend', 'BestFriend', 'Blocked');--> statement-breakpoint
CREATE TABLE "friendRequest" (
	"userId1" uuid NOT NULL,
	"userId2" uuid NOT NULL,
	"from" "friendRequestFrom" DEFAULT 'User1' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "friendRequest_userId1_userId2_pk" PRIMARY KEY("userId1","userId2"),
	CONSTRAINT "friendRequest_userId1_unique" UNIQUE("userId1"),
	CONSTRAINT "friendRequest_userId2_unique" UNIQUE("userId2")
);
--> statement-breakpoint
CREATE TABLE "usersToUsers" (
	"userId1" uuid,
	"userId2" uuid,
	"status" "usersToUsersStatus" NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usersToUsers_userId1_userId2_pk" PRIMARY KEY("userId1","userId2")
);
--> statement-breakpoint
ALTER TABLE "friendRequest" ADD CONSTRAINT "friendRequest_userId1_user_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "friendRequest" ADD CONSTRAINT "friendRequest_userId2_user_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "usersToUsers" ADD CONSTRAINT "usersToUsers_userId1_user_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "usersToUsers" ADD CONSTRAINT "usersToUsers_userId2_user_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "friendRequest_userId1Index" ON "friendRequest" USING btree ("userId1");--> statement-breakpoint
CREATE UNIQUE INDEX "friendRequest_userId2Index" ON "friendRequest" USING btree ("userId2");--> statement-breakpoint
CREATE UNIQUE INDEX "usersToUsers_userId1Index" ON "usersToUsers" USING btree ("userId1");--> statement-breakpoint
CREATE UNIQUE INDEX "usersToUsers_userId2Index" ON "usersToUsers" USING btree ("userId2");