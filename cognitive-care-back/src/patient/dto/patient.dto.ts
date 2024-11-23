import { AutoMap } from "@automapper/classes";
import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { formatDate } from 'date-fns';

export class PatientDto {

    @IsString()
    @AutoMap()
    id: string;
    @AutoMap()
    @IsString()
    fullName: string;
    @AutoMap()
    @IsString()
    dni: string;

    @AutoMap()
    @IsString()
    @Transform((v) =>{
        return new Date(v.value)
    }, { toClassOnly: true })
    @Transform((v) => {
        return formatDate(v.value, 'yyyy-MM-dd')
    }, { toPlainOnly: true })
    birthDate: Date;

    @IsString()
    @AutoMap()
    summary: string;

    @IsString()
    @AutoMap()
    aiSummary: string;

    @IsString()
    @AutoMap()
    symptoms: string;

    @IsString()
    @AutoMap()
    aiSymptoms: string;

    @IsString()
    @AutoMap()
    notes: string;
}