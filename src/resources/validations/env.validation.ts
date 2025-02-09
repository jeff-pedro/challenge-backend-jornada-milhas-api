import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsHash,
  IsNumber,
  IsOptional,
  IsPort,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  COHERE_API_KEY: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsOptional()
  @IsString()
  REDIS_HOST: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number; 
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  CACHE_TTL: number;

  @IsString()
  HASH_SALT: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables, 
    config, 
    { enableImplicitConversion: true });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}
