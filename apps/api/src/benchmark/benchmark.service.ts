import { BadRequestException, Injectable } from '@nestjs/common';
import { performance } from 'node:perf_hooks';
import { ENGINE_MAP } from '../engines/engine-catalog';
import { ResultsService, EngineResultInput } from '../results/results.service';
import { RunBenchmarkDto } from './run-benchmark.dto';

const WARMUP_RUNS = 50;

@Injectable()
export class BenchmarkService {
  constructor(private readonly results: ResultsService) {}

  async run(dto: RunBenchmarkDto) {
    const data = this.parseData(dto.data);
    const iterations = dto.iterations ?? 1000;

    const results: EngineResultInput[] = dto.engines.map((item) =>
      this.measureEngine(item.engine, item.template, data, iterations),
    );

    return this.results.saveRun({
      name: dto.name?.trim() || 'Untitled run',
      iterations,
      data,
      results,
    });
  }

  private parseData(raw: any): any {
    if (raw == null) return {};
    if (typeof raw !== 'string') return raw;
    try {
      return JSON.parse(raw);
    } catch {
      throw new BadRequestException('`data` is not valid JSON');
    }
  }

  private measureEngine(
    engine: string,
    template: string,
    data: any,
    iterations: number,
  ): EngineResultInput {
    const def = ENGINE_MAP[engine];
    if (!def) {
      return this.errorResult(engine, `Unknown engine "${engine}"`);
    }

    try {
      const compileStart = performance.now();
      const render = def.compile(template);
      const compileTimeMs = performance.now() - compileStart;

      let output = '';
      const warmup = Math.min(WARMUP_RUNS, iterations);
      for (let i = 0; i < warmup; i++) output = render(data);

      const renderStart = performance.now();
      for (let i = 0; i < iterations; i++) output = render(data);
      const totalRenderMs = performance.now() - renderStart;
      const renderTimeMs = totalRenderMs / iterations;

      return {
        engine,
        compileTimeMs: round(compileTimeMs),
        renderTimeMs: round(renderTimeMs),
        totalTimeMs: round(compileTimeMs + totalRenderMs),
        outputSize: Buffer.byteLength(output, 'utf8'),
        error: null,
      };
    } catch (e) {
      return this.errorResult(engine, (e as Error).message);
    }
  }

  private errorResult(engine: string, error: string): EngineResultInput {
    return {
      engine,
      compileTimeMs: null,
      renderTimeMs: null,
      totalTimeMs: null,
      outputSize: null,
      error,
    };
  }
}

function round(value: number): number {
  return Math.round(value * 100000) / 100000;
}
