import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { PredictionsService } from "./predictions.service";
import { PredictionDto } from "./dto/prediction.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller('prediction')
export class PredictionsController {
  constructor(private readonly predictionService: PredictionsService) { }

  @ApiOperation({
    operationId: 'findPredictionsFromPatient'
  })
  @Get(':patientId')
  async findByPatientId(
    @Param('patientId') patientId: string
  ): Promise<PredictionDto> {
    const result = await this.predictionService.findOneByPatientId(patientId);
    if(!result) {
        throw new NotFoundException('Not found predictions for patient id')
    }
    
    return result;
  }
}
