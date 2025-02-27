import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
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
  GEMINI_API_KEY: string;

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

  @IsString()
  @IsIn(["true", "false"])
  DB_SSL_ENABLED: string;
  
  @IsOptional()
  @IsString()
  DB_SSL_CA_PATH: string;

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

  @IsString()
  JWT_SECRET: string;
  
  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  UPLOAD_DESTINATION_PATH: string;
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
