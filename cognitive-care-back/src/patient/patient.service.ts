import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { db } from 'src/db';
import { appointments, patients } from 'src/db/schema';
import { PatientDto } from './dto/patient.dto';
import { asc, eq, sql } from 'drizzle-orm';
import { PatientSmallDto } from './dto/patient-small.dto';
import { PatientMapper } from './mappers/patient.mapper';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PatientEntity } from './entities/patient.entity';
import { PredictionsService } from 'src/predictions/predictions.service';

@Injectable()
export class PatientService {

  constructor(
    private readonly predictionsService: PredictionsService,
    @InjectMapper() private readonly mapper: Mapper
  ) {

  }

  async createOrUpdate(createPatientDto: CreatePatientDto): Promise<PatientDto> {

    if (createPatientDto.id) {

      const patient = await this.findOne(createPatientDto.id);
      if (!patient) {
        throw new HttpException('Not found patient with the id indicated', HttpStatus.NOT_FOUND);
      }

      const { id, ...attrsToUpdate } = createPatientDto;
      const [result] = await db.update(patients).set(attrsToUpdate).where(eq(patients.id, id)).returning();
      
      if(patient.symptoms !== result.symptoms) {
        await this.predictionsService.requestRecalculatePrediction(createPatientDto.id);
      }

      return result;
    }

    const [result] = await db.insert(patients).values({
      ...createPatientDto,
    }).returning();
    await this.predictionsService.requestRecalculatePrediction(createPatientDto.id);
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

    if (!patient) {
      return null;
    }

    return this.mapper.map(patient, PatientEntity, PatientDto);
  }

  async remove(id: string): Promise<PatientDto> {
    const [patient] = await db.delete(patients).where(eq(patients.id, id)).returning();
    return patient;
  }
}
