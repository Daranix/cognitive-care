import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCognitiveScoreDto } from './dto/create-cognitive-score.dto';
import { db } from 'src/db';
import { cognitiveScores, patients } from 'src/db/schema';
import { desc, eq } from 'drizzle-orm';
import { CognitiveScoreDto } from './dto/cognitive-score.dto';
import { PredictionsService } from 'src/predictions/predictions.service';

@Injectable()
export class CognitiveScoresService {

  constructor(private predictionsService: PredictionsService) {

  }

  async create(createCognitiveScoreDto: CreateCognitiveScoreDto) {
    
    let updatedData: CognitiveScoreDto | undefined;

    if(createCognitiveScoreDto.id) {
      
      const score = await this.findOne(createCognitiveScoreDto.id);

      if(!score) {
        throw new HttpException(`Score with id ${createCognitiveScoreDto.id} not found`, HttpStatus.NOT_FOUND);
      }

      const [updated] = await db.update(cognitiveScores).set({ ...createCognitiveScoreDto }).where(eq(cognitiveScores.id, createCognitiveScoreDto.id)).returning();
      updatedData = updated;
    } else {
      const [inserted] = await db.insert(cognitiveScores).values({ ...createCognitiveScoreDto }).returning();
      updatedData = inserted;
    }
    
    await this.predictionsService.requestRecalculatePrediction(createCognitiveScoreDto.patientId);
    return updatedData;
  }

  async findByPatientId(patientId: string): Promise<CognitiveScoreDto[]> {
    return await db.select().from(cognitiveScores).where(eq(cognitiveScores.patientId, patientId)).orderBy(desc(cognitiveScores.assessmentDate)); 
  }

  async findOne(id: string) {
    const [score] = await db.select().from(cognitiveScores).where(eq(cognitiveScores.id, id)).limit(1);
    return score;
  }

}
