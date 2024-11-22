import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { db } from 'src/db';
import { appointments, patients } from 'src/db/schema';
import { PatientDto } from './dto/patient.dto';
import { asc, eq, sql } from 'drizzle-orm';
import { PatientSmallDto } from './dto/patient-small.dto';

@Injectable()
export class PatientService {
  async create(createPatientDto: CreatePatientDto): Promise<PatientDto> {

    const [result] = await db.insert(patients).values({
      ...createPatientDto,
    }).returning();

    return result;
  }

  async findAll(): Promise<PatientSmallDto[]> {
    const result = await db
    .select({
      patientId: patients.id,
      patientName: patients.fullName,
      patientDni: patients.dni,
      nextAppointment: sql<string>`
        (SELECT 
          date
        FROM ${appointments} 
        WHERE ${appointments.patientId} = ${patients.id} 
          AND date >= CURRENT_TIMESTAMP 
        ORDER BY date ASC
        LIMIT 1)
      `,
      lastAppointment: sql<string>`
        (SELECT 
          date
        FROM ${appointments} 
        WHERE ${appointments.patientId} = ${patients.id} 
          AND date < CURRENT_TIMESTAMP 
        ORDER BY date DESC
        LIMIT 1)
      `
    })
    .from(patients)
    .orderBy(
      sql`(
        SELECT date
        FROM ${appointments} 
        WHERE ${appointments.patientId} = ${patients.id} 
          AND date >= CURRENT_TIMESTAMP 
        ORDER BY date ASC
        LIMIT 1
      ) ASC NULLS LAST`,
      sql`(
        SELECT date
        FROM ${appointments} 
        WHERE ${appointments.patientId} = ${patients.id} 
          AND date < CURRENT_TIMESTAMP 
        ORDER BY date DESC
        LIMIT 1
      ) DESC NULLS LAST`
    );
    
    return result;
  }

  async findOne(patientId: string): Promise<PatientDto | null> {

    const [patient] = await db.select()
      .from(patients).where((patient) => eq(patient.id, patientId))
      .limit(1);

    return patient;
  }

  async remove(id: string): Promise<PatientDto> {
    const [patient] = await db.delete(patients).where(eq(patients.id, id)).returning();
    return patient;
  }
}
