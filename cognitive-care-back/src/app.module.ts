import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes'
import { AppointmentModule } from './appointment/appointment.module';
import { LlmModule } from './llm/llm.module';
import { CognitiveScoresModule } from './cognitive-scores/cognitive-scores.module';
import { PredictionsModule } from './predictions/predictions.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    PatientModule,
    AppointmentModule,
    LlmModule,
    CognitiveScoresModule,
    PredictionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
