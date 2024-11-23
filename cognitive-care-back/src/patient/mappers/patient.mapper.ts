import { createMap, type Mapper, type MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { PatientDto } from "../dto/patient.dto";
import { PatientEntity } from "../entities/patient.entity";

@Injectable()
export class PatientMapper extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, PatientEntity, PatientDto);
            createMap(mapper, PatientDto, PatientEntity);
        };
    }
}