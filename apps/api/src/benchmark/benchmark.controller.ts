import { Body, Controller, Post } from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';
import { RunBenchmarkDto } from './run-benchmark.dto';

@Controller('benchmark')
export class BenchmarkController {
  constructor(private readonly benchmark: BenchmarkService) {}

  @Post('run')
  run(@Body() dto: RunBenchmarkDto) {
    return this.benchmark.run(dto);
  }
}
