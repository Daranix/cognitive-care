import { PartialType } from '@nestjs/swagger';
import { CreatePredictionDto } from './create-prediction.dto';

export class UpdatePredictionDto extends PartialType(CreatePredictionDto) {}
