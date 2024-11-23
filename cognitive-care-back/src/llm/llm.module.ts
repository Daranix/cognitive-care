import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [LlmService],
  exports: [LlmService]
})
export class LlmModule {}
