import { AutoMap } from "@automapper/classes";

export class PatientEntity {
    @AutoMap()
    id: string;
    
    @AutoMap()
    fullName: string;

    @AutoMap()
    dni: string;

    @AutoMap()
    birthDate: Date;

    @AutoMap()
    summary: string;

    @AutoMap()
    aiSummary: string;

    @AutoMap()
    symptoms: string;

    @AutoMap()
    aiSymptoms: string;

    @AutoMap()
    notes: string;
}
