import { Type } from 'class-transformer';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class EngineTemplateDto {
  @IsString()
  engine: string;

  @IsString()
  template: string;
}

export class RunBenchmarkDto {
  @IsOptional()
  @IsString()
  name?: string;

  @Allow()
  data?: any;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  iterations?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EngineTemplateDto)
  engines: EngineTemplateDto[];
}
