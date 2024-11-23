import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateAppointmentDto {

    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    patientId: string;

    @IsDate()
    @Transform((v) =>{
        return new Date(v.value)
    }, { toClassOnly: true })
    date: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    transcriptionSummary: string | null;
}
