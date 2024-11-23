ALTER TABLE "cognitive_scores" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "cognitive_scores" ADD COLUMN "scores" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "cognitive_scores" ADD COLUMN "tool_used" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "cognitive_scores" DROP COLUMN IF EXISTS "score";