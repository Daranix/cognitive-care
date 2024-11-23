import { PartialType } from '@nestjs/swagger';
import { CreateCognitiveScoreDto } from './create-cognitive-score.dto';

export class UpdateCognitiveScoreDto extends PartialType(CreateCognitiveScoreDto) {}
