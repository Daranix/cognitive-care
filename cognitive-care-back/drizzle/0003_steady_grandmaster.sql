ALTER TABLE "appointments" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_audio_file_unique" UNIQUE("audio_file");