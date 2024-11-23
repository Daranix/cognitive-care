import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientMapper } from './mappers/patient.mapper';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [AppointmentModule],
  controllers: [PatientController],
  providers: [PatientService, PatientMapper],
})
export class PatientModule {}
