import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { appointments } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { AppointmentSmallDto } from './dto/appointment-small.dto';
import { join } from 'node:path';
import { createReadStream, createWriteStream, ReadStream } from 'node:fs';
import * as crypto from 'node:crypto';
import { TranscriptionService } from './transcription.service';
import { TranscriptionDto } from './dto/transcription.dto';

@Injectable()
export class AppointmentService {

  private readonly logger = new Logger(AppointmentService.name);

  constructor(private readonly transcriptionService: TranscriptionService) {}

  async createOrUpdateAppointment(createAppointmentDto: CreateAppointmentDto) {

    if(createAppointmentDto.id) {
      const result = await this.findOne(createAppointmentDto.id);
      if(!result) {
        throw new HttpException('An appointment with the indicated id doesnt exists', HttpStatus.BAD_REQUEST);
      }

      // Update
      const [appointment] = await db.update(appointments).set({ ...createAppointmentDto }).returning();
      return appointment;
    }
    
    // Create
    const [appointment] = await db.insert(appointments)
      .values({
        ...createAppointmentDto
      })
      .returning();

    return appointment;
  }

  async findAll() {
    return await db.select().from(appointments);
  }

  async findOne(id: string) {
    const appointment = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .limit(1);

    if (!appointment.length) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment[0];
  }


  async remove(id: string) {
    const appointment = await db
      .delete(appointments)
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment.length) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment[0];
  }

  async findByPatientId(patientId: string): Promise<AppointmentSmallDto[]> {

    const result = await db.select({
      date: appointments.date,
      id: appointments.id,
      patientId: appointments.patientId
    }).from(appointments).where(eq(appointments.patientId, patientId));

    return result;
  }

  async uploadFileAudio(
    appointmentId: string,
    file: Express.Multer.File
  ) {
    return db.transaction(async (tx) => {
      const fileId = await this.saveFile(file);
      await tx.update(appointments).set({ audioFile: fileId, transcription: 'processing' }).where(eq(appointments.id, appointmentId));
      this.transcriptionProcess(appointmentId);
      return fileId;
    });
  }

  private saveFile(file: Express.Multer.File) {
    return new Promise<string>((resolve, reject) => {

      const filename = `${crypto.randomUUID().toString()}-${file.originalname}`

      // Full path where file will be stored
      const filepath = join(process.env.STORE_AUDIOS_BASE_PATH, filename);

      // Create write stream
      const writeStream = createWriteStream(filepath);

      // Handle stream events
      writeStream.on('error', (error) => {
        reject(new Error(`Failed to write file: ${error.message}`));
      });

      writeStream.on('finish', () => {
        resolve(filename);
      });

      // Write the file buffer to stream
      writeStream.write(file.buffer);
      writeStream.end();
      
    });
  }

  async getFileByAppointmentId(appointmentId: string): Promise<ReadStream> {
    const { audioFile } = await this.findOne(appointmentId);
    const fileFullPath = join(process.env.STORE_AUDIOS_BASE_PATH, audioFile);
    const file = createReadStream(fileFullPath);
    return file;
  }

  async transcribeAppointmentAudio(
    appointmentId: string
  ): Promise<TranscriptionDto> {
    return await this.transcriptionService.transcribeAppointment(appointmentId);
  }

  private async transcriptionProcess(appointmentId: string) {
    try {
      await db.transaction(async (tx) => {
        await tx.update(appointments).set({ transcription: 'processing' }).where(eq(appointments.id, appointmentId));
        const result = await this.transcribeAppointmentAudio(appointmentId);
        const transcription = result.segments.map((s) => s.trim()).join('\n');
        await tx.update(appointments).set({ transcription }).where(eq(appointments.id, appointmentId));
      });
    } catch(ex) {
      await db.update(appointments).set({ transcription: 'error' }).where(eq(appointments.id, appointmentId));
      this.logger.error(`Failed to transcribe audio file for appointment ${appointmentId}`, ex);
    }

  }

}
