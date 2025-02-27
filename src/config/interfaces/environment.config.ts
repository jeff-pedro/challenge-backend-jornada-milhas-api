import { AppConfig } from "./app.config";
import { DatabaseConfig } from "./database.config";

export type Environment = 'development' | 'production' | 'test';

export interface EnvironmentConfig {
  app: AppConfig;
  db: DatabaseConfig;
}