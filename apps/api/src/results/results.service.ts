import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BenchmarkRun } from './benchmark-run.entity';
import { EngineResult } from './engine-result.entity';

export interface EngineResultInput {
  engine: string;
  compileTimeMs: number | null;
  renderTimeMs: number | null;
  totalTimeMs: number | null;
  outputSize: number | null;
  error: string | null;
}

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(BenchmarkRun)
    private readonly runs: Repository<BenchmarkRun>,
  ) {}

  async saveRun(input: {
    name: string;
    iterations: number;
    data: any;
    results: EngineResultInput[];
  }): Promise<BenchmarkRun> {
    const run = this.runs.create({
      name: input.name,
      iterations: input.iterations,
      data: input.data,
      results: input.results.map((r) => {
        const er = new EngineResult();
        Object.assign(er, r);
        return er;
      }),
    });
    return this.runs.save(run);
  }

  findAll(): Promise<BenchmarkRun[]> {
    return this.runs.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<BenchmarkRun> {
    const run = await this.runs.findOne({ where: { id } });
    if (!run) throw new NotFoundException(`Benchmark run ${id} not found`);
    return run;
  }

  async remove(id: string): Promise<void> {
    const run = await this.findOne(id);
    await this.runs.remove(run);
  }
}
