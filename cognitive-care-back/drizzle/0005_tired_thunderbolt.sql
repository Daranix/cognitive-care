CREATE TABLE IF NOT EXISTS "predictions" (
	"patient_id" uuid PRIMARY KEY NOT NULL,
	"prediction_data" jsonb NOT NULL,
	"status" varchar NOT NULL
);
