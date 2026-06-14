import { Module } from '@nestjs/common';
import { EnginesController } from './engines.controller';

@Module({
  controllers: [EnginesController],
})
export class EnginesModule {}
