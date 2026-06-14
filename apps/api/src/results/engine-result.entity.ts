import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BenchmarkRun } from './benchmark-run.entity';

@Entity('engine_results')
export class EngineResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  engine: string;

  @Column('double precision', { nullable: true })
  compileTimeMs: number | null;

  @Column('double precision', { nullable: true })
  renderTimeMs: number | null;

  @Column('double precision', { nullable: true })
  totalTimeMs: number | null;

  @Column('int', { nullable: true })
  outputSize: number | null;

  @Column('text', { nullable: true })
  error: string | null;

  @ManyToOne(() => BenchmarkRun, (run) => run.results, { onDelete: 'CASCADE' })
  run: BenchmarkRun;
}
