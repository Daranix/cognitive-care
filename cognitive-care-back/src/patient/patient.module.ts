import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientMapper } from './mappers/patient.mapper';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { CognitiveScoresModule } from 'src/cognitive-scores/cognitive-scores.module';
import { PredictionsModule } from 'src/predictions/predictions.module';

@Module({
  imports: [AppointmentModule, CognitiveScoresModule, PredictionsModule],
  controllers: [PatientController],
  providers: [PatientService, PatientMapper],
})
export class PatientModule {}
