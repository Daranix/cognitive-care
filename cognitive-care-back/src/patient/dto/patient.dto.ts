import { AutoMap } from "@automapper/classes";
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsOptional, IsString } from "class-validator";
import { formatDate } from 'date-fns';

export class PatientDto {

    @IsString()
    @IsOptional()
    @AutoMap()
    id: string;

    @AutoMap()
    @IsString()
    fullName: string;
    @AutoMap()
    @IsString()
    dni: string;

    @AutoMap()
    @IsDate()
    @Transform((v) =>{
        return new Date(v.value)
    }, { toClassOnly: true })
    @Transform((v) => {
        return formatDate(v.value, 'yyyy-MM-dd')
    }, { toPlainOnly: true })
    birthDate: Date;

    @IsString()
    @IsOptional()
    @AutoMap()
    summary: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    aiSummary: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    symptoms: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    aiSymptoms: string;

    @IsString()
    @IsOptional()
    @AutoMap()
    notes: string;
}