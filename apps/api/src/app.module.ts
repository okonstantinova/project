import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenchmarkModule } from './benchmark/benchmark.module';
import { EnginesModule } from './engines/engines.module';
import { BenchmarkRun } from './results/benchmark-run.entity';
import { EngineResult } from './results/engine-result.entity';
import { ResultsModule } from './results/results.module';

const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(databaseUrl
        ? { url: databaseUrl, ssl: { rejectUnauthorized: false } }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'templbench',
          }),
      entities: [BenchmarkRun, EngineResult],
      synchronize: true,
      retryAttempts: 15,
      retryDelay: 3000,
    }),
    EnginesModule,
    BenchmarkModule,
    ResultsModule,
  ],
})
export class AppModule {}
