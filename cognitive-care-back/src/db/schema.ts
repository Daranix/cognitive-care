import {
    pgTable,
    serial,
    varchar,
    timestamp,
    text,
    integer,
    date,
    decimal,
    uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
    details: text('details'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notes table - for general medical notes
export const notes = pgTable('notes', {
    id: uuid('id').primaryKey(),
    patientId: uuid('patient_id').notNull().references(() => patients.id),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cognitive Scores table
export const cognitiveScores = pgTable('cognitive_scores', {
    id: uuid('id').primaryKey(),
    patientId: uuid('patient_id').notNull().references(() => patients.id),
    score: decimal('score').notNull(),
    observations: text('observations'),
    assessmentDate: date('assessment_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations for appointments
export const appointmentsRelations = relations(appointments, ({ one }) => ({
    patient: one(patients, {
        fields: [appointments.patientId],
        references: [patients.id],
    }),
}));


// Relations for cognitive scores
export const cognitiveScoresRelations = relations(cognitiveScores, ({ one }) => ({
    patient: one(patients, {
        fields: [cognitiveScores.patientId],
        references: [patients.id],
    }),
}));