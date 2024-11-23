ALTER TABLE "appointments" ADD COLUMN "audio_file" uuid;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "transcription" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "transcription_summary" text;--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN IF EXISTS "details";