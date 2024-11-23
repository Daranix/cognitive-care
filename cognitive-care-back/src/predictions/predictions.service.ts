import { Injectable, Logger } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { db } from 'src/db';
import { predictions } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { PredictionDto } from './dto/prediction.dto';
import { CognitivePredictor } from './cognitive-predictor.service';

@Injectable()
export class PredictionsService {

  private readonly logger = new Logger(PredictionsService.name);

  constructor(
    private cognitivePredictorService: CognitivePredictor
  ) {}

  async requestRecalculatePrediction(patientId: string) {
    await this.createOrUpdate({ patientId, predictionData: null, status: 'processing' });
    this.cognitivePredictorService.predict(patientId).then((r) => {
      this.createOrUpdate({
        patientId,
        predictionData: r,
        status: 'completed'
      })
    }).catch((err) => {
      this.logger.error(`Last prediction processing for patientId: ${patientId} went wrong`, err);
      this.createOrUpdate({
        patientId,
        predictionData: null,
        status: 'error'
      });
    })
  }

  async createOrUpdate(prediction: PredictionDto) {
    
    // Check if exists
    const p = await this.findOneByPatientId(prediction.patientId);
    if(p) { // Update
      const [predictionUpdated] = await db.update(predictions).set({ ...prediction }).where(eq(predictions.patientId, prediction.patientId)).returning();
      return predictionUpdated;
    }

    // Insert
    const [predictionInserted] = await db.insert(predictions).values({ ...prediction }).returning();
    return predictionInserted;
  }

  async findOneByPatientId(patientId: string): Promise<PredictionDto> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.patientId, patientId)).limit(1);
    return prediction;
  }

}
