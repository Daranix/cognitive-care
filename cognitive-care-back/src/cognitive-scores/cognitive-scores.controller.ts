import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CognitiveScoresService } from './cognitive-scores.service';
import { CreateCognitiveScoreDto } from './dto/create-cognitive-score.dto';
import { UpdateCognitiveScoreDto } from './dto/update-cognitive-score.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CognitiveScoreDto } from './dto/cognitive-score.dto';

@ApiTags('cognitive-scores')
@Controller('cognitive-scores')
export class CognitiveScoresController {
  constructor(private readonly cognitiveScoresService: CognitiveScoresService) {}

  @ApiOperation({
    operationId: 'createOrUpdateCognitiveScore'
  })
  @Post()
  create(
    @Body() createCognitiveScoreDto: CreateCognitiveScoreDto
  ): Promise<CognitiveScoreDto> {
    return this.cognitiveScoresService.create(createCognitiveScoreDto);
  }

  @ApiOperation({
    operationId: 'findScoreById'
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CognitiveScoreDto> {
    return this.cognitiveScoresService.findOne(id);
  }

}
