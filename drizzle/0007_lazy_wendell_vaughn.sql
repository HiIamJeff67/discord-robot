ALTER TYPE "public"."notificationType" ADD VALUE 'FriendRequest';--> statement-breakpoint
ALTER TABLE "notification" RENAME COLUMN "link" TO "linkId";--> statement-breakpoint
ALTER TABLE "notification" DROP CONSTRAINT "notification_creatorId_user_id_fk";
--> statement-breakpoint
DROP INDEX "notification_creatorIdIndex";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "creatorId";