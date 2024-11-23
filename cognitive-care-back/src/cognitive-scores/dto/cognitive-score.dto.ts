import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CognitiveScoreDto {
    
    @IsUUID()
    @IsOptional()
    id: string;

    @IsUUID()
    patientId: string;

    @IsString()
    assessmentDate: Date;

    @IsString()
    toolUsed: string;

    @IsNotEmpty()
    scores: Record<string, number>;

}
