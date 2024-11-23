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
import { AppointmentService } from 'src/appointment/appointment.service';
import { AppointmentSmallDto } from 'src/appointment/dto/appointment-small.dto';
import { CognitiveScoresService } from 'src/cognitive-scores/cognitive-scores.service';
import { CognitiveScoreDto } from 'src/cognitive-scores/dto/cognitive-score.dto';

@ApiTags('patient')
@Controller('patient')
export class PatientController {

  constructor(
    private readonly patientService: PatientService,
    private readonly appointmentService: AppointmentService,
    private readonly cognitiveScoresService: CognitiveScoresService
  ) { }

  @ApiOperation({
    operationId: 'createOrUpdatePatient'
  })
  @Post()
  createOrUpdate(@Body() createPatientDto: CreatePatientDto): Promise<PatientDto> {
    return this.patientService.createOrUpdate(createPatientDto);
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

  @ApiOperation({
    operationId: 'findAppointments'
  })
  @Get(':patientId/appointments')
  async findAppointments(
    @Param('patientId') patientId: string
  ): Promise<AppointmentSmallDto[]> {
    return this.appointmentService.findByPatientId(patientId)
  }

  @ApiOperation({
    operationId: 'findCognitiveScores'
  })
  @Get(':patientId/cognitive-scores')
  async findCognitiveScores(
    @Param('patientId') patientId: string
  ): Promise<CognitiveScoreDto[]> {
    return this.cognitiveScoresService.findByPatientId(patientId);
  }
}
