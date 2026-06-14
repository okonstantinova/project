import { Controller, Get } from '@nestjs/common';
import { ENGINES, SAMPLE_DATA } from './engine-catalog';

@Controller('engines')
export class EnginesController {
  @Get()
  list() {
    return {
      engines: ENGINES.map(({ engine, label, description, syntax, defaultTemplate }) => ({
        engine,
        label,
        description,
        syntax,
        defaultTemplate,
      })),
      sampleData: SAMPLE_DATA,
    };
  }
}
