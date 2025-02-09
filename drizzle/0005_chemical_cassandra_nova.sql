ALTER TYPE "public"."usersToUsersStatus" ADD VALUE 'Pending' BEFORE 'Friend';--> statement-breakpoint
DROP TABLE "friendRequests" CASCADE;