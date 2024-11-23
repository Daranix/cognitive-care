ALTER TABLE "notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "notes" CASCADE;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "audio_file" SET DATA TYPE varchar;