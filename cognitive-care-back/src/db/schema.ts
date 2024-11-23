import {
    pgTable,
    varchar,
    timestamp,
    text,
    date,
    decimal,
    uuid,
    json,
    jsonb
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { PredictionDataDto } from 'src/predictions/dto/prediction-data.dto';
import type {  PredictionStatus } from 'src/predictions/dto/prediction.dto';

// Patients table
export const patients = pgTable('patients', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    birthDate: date('date_of_birth', { mode: 'date' }).notNull(),
    dni: varchar('dni').notNull(),
    summary: text('summary'),
    aiSummary: text('ai_summary'),
    notes: text('notes'),
    symptoms: text('symptoms'),
    aiSymptoms: text('aiSymptoms'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Patient relations
export const patientsRelations = relations(patients, ({ many }) => ({
    appointments: many(appointments),
    cognitiveScores: many(cognitiveScores),
}));

// Appointments table
export const appointments = pgTable('appointments', {
    id: uuid('id').primaryKey().defaultRandom(),
    patientId: uuid('patient_id').notNull().references(() => patients.id),
    date: timestamp('date', { mode: 'date' }).notNull(),
    audioFile: varchar('audio_file').unique(),
    transcription: text('transcription'),
    notes: text('notes'),
    transcriptionSummary: text('transcription_summary'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cognitive Scores table
export const cognitiveScores = pgTable('cognitive_scores', {
    id: uuid('id').primaryKey().defaultRandom(),
    patientId: uuid('patient_id').notNull().references(() => patients.id),
    scores: jsonb('scores').$type<Record<string, number>>().notNull(),
    toolUsed: varchar('tool_used').notNull(),
    observations: text('observations'),
    assessmentDate: date('assessment_date', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const predictions = pgTable('predictions', {
    patientId: uuid('patient_id').primaryKey().notNull(),
    predictionData: jsonb('prediction_data').$type<PredictionDataDto>(),
    status: varchar('status').$type<PredictionStatus>().notNull()
});

// Relations for appointments
export const appointmentsRelations = relations(appointments, ({ one }) => ({
    patient: one(patients, {
        fields: [appointments.patientId],
        references: [patients.id],
    }),
}));

// Relations for predictions
export const predictionsRelations = relations(predictions, ({ one }) => ({
    patient: one(patients, {
        fields: [predictions.patientId],
        references: [patients.id]
    })
}));

// Relations for cognitive scores
export const cognitiveScoresRelations = relations(cognitiveScores, ({ one }) => ({
    patient: one(patients, {
        fields: [cognitiveScores.patientId],
        references: [patients.id],
    }),
}));