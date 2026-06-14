import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EngineResult } from './engine-result.entity';

@Entity('benchmark_runs')
export class BenchmarkRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Untitled run' })
  name: string;

  @Column('int')
  iterations: number;

  @Column('jsonb', { nullable: true })
  data: any;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => EngineResult, (r) => r.run, { cascade: true, eager: true })
  results: EngineResult[];
}
