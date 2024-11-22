import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PatientDto } from './dto/patient.dto';
import { PatientSmallDto } from './dto/patient-small.dto';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({
    operationId: 'createPatient'
  })
  @Post()
  create(@Body() createPatientDto: CreatePatientDto): Promise<PatientDto> {
    return this.patientService.create(createPatientDto);
  }

  @ApiOperation({
    operationId: 'searchPatients'
  })
  @ApiParam({
    name: 'query',
    required: false
  })
  @Get('search')
  searchPatients(
    @Query('query') query?: string
  ): Promise<PatientSmallDto[]> {
    return this.patientService.findAll();
  }

  @ApiOperation({
    operationId: 'findPatientById'
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PatientDto> {
    return this.patientService.findOne(id);
  }


  @ApiOperation({
    operationId: 'removePatientById'
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<PatientDto> {
    return this.patientService.remove(id);
  }
}