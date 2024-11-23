import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Logger, HttpException, HttpStatus, StreamableFile, Sse } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AppointmentDto } from './dto/appointment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenericResponse } from 'src/utils/generic-response.dto';
import { LlmService } from 'src/llm/llm.service';
import { TRANSCRIPTION_SUMMARY_PROMPT } from './prompts/transcription-summary.prompt';
import { Observable } from 'rxjs';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {

  private readonly logger = new Logger(AppointmentController.name);

  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly llmService: LlmService
  ) { }


  @ApiOperation({
    operationId: 'createOrUpdateAppointment'
  })
  @Post()
  createOrUpdateAppointment(@Body() createAppointmentDto: CreateAppointmentDto): Promise<AppointmentDto> {
    return this.appointmentService.createOrUpdateAppointment(createAppointmentDto);
  }

  @ApiOperation({
    operationId: 'findAppoinmentById'
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AppointmentDto> {
    return this.appointmentService.findOne(id);
  }

  @ApiOperation({
    operationId: 'uploadAudioFile'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':id/upload-audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAudio(
    @Param('id') appointmentId: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<GenericResponse<string>> {
    try {
      const fileId = await this.appointmentService.uploadFileAudio(appointmentId, file);
      return { result: fileId };
    } catch(ex) {
      this.logger.error('Failed to upload the file', ex);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    operationId: 'getAudioForAppointment'
  })
  @ApiOkResponse({
    content: {
      'application/octect-stream': {
        schema:  { type: 'string', format: 'binary' },
      }
    }
  })
  @ApiProduces('application/octect-stream')
  @Get(':id/audio')
  async getAudioForAppointment(
    @Param('id') appointmentId: string
  ): Promise<StreamableFile> {
    const readStream = await this.appointmentService.getFileByAppointmentId(appointmentId);
    return new StreamableFile(readStream);
  }

  @ApiOperation({
    operationId: 'transcribeAppointmentAudio'
  })
  @Get(':id/transcribe')
  async transcribeAppointmentAudio(
    @Param('id') appointmentId: string
  ) {
    return this.appointmentService.transcribeAppointmentAudio(appointmentId);
  }

  @ApiExcludeEndpoint()
  @Sse(':id/transcription-sumarize')
  async summaryOfTranscriptionByAppointmentId(
    @Param('id') id: string,
  ): Promise<Observable<MessageEvent>> {
    const { transcription } = await this.appointmentService.findOne(id);
    return this.llmService.sendLlmRequest({ system: TRANSCRIPTION_SUMMARY_PROMPT, user: `Analize this transcription:\n\n${transcription}` });
  }

}
