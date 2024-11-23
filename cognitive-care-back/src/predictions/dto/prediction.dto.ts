import { ApiProperty } from "@nestjs/swagger";
import { PredictionDataDto } from "./prediction-data.dto";


export const PREDICTION_STATUS = [
    'completed',
    'processing',
    'error'
] as const;

export type PredictionStatus = typeof PREDICTION_STATUS[number];

export class PredictionDto {
    patientId: string;
    predictionData: PredictionDataDto;
    @ApiProperty({
        enum: PREDICTION_STATUS
    })
    status: PredictionStatus;
}