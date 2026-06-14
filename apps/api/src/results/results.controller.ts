import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly results: ResultsService) {}

  @Get()
  findAll() {
    return this.results.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.results.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.results.remove(id);
  }
}
