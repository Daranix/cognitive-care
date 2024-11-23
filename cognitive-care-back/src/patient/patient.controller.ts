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

@ApiTags('patient')
@Controller('patient')
export class PatientController {

  constructor(
    private readonly patientService: PatientService,
    private readonly appointmentService: AppointmentService
  ) { }

  @ApiOperation({
    operationId: 'createOrUpdatePatient'
  })
  @Post()
  createOrUpdate(@Body() createPatientDto: CreatePatientDto): Promise<PatientDto> {
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

  @ApiOperation({
    operationId: 'findAppointments'
  })
  @Get(':patientId/appointments')
  async findAppointments(
    @Param('patientId') patientId: string
  ): Promise<AppointmentSmallDto[]> {
    return this.appointmentService.findByPatientId(patientId)
  }
}
