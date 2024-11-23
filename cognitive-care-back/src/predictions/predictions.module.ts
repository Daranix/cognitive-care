import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { CognitivePredictor } from './cognitive-predictor.service';

@Module({
  controllers: [PredictionsController],
  providers: [PredictionsService, CognitivePredictor],
  exports: [PredictionsService]
})
export class PredictionsModule {}
