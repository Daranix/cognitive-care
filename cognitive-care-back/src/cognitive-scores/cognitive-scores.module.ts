import { Module } from '@nestjs/common';
import { CognitiveScoresService } from './cognitive-scores.service';
import { CognitiveScoresController } from './cognitive-scores.controller';
import { PredictionsModule } from 'src/predictions/predictions.module';

@Module({
  imports: [PredictionsModule],
  controllers: [CognitiveScoresController],
  providers: [CognitiveScoresService],
  exports: [CognitiveScoresService]
})
export class CognitiveScoresModule {}
