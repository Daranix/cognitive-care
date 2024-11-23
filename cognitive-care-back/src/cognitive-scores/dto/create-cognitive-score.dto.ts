import { AutoMap } from "@automapper/classes";
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCognitiveScoreDto {
    
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsUUID()
    patientId: string;

    @Transform((v) =>{
        return new Date(v.value)
    }, { toClassOnly: true })
    @IsDate()
    assessmentDate: Date;

    @IsString()
    toolUsed: string;

    @IsNotEmpty()
    scores: Record<string, number>;

}
