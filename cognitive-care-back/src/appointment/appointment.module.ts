import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TranscriptionService } from './transcription.service';
import { LlmModule } from 'src/llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, TranscriptionService],
  exports: [AppointmentService]
})
export class AppointmentModule { }
