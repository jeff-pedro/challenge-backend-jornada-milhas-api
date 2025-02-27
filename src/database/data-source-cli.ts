import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from '../config/interfaces/database.config';
import { Environment } from '../config/interfaces/environment.config';
import { getDevelopmentConfig, getProductionConfig, getTestConfig } from '../config/database/database.config';

const environment = process.env.NODE_ENV || 'development';
const isSSLEnabled = process.env.DB_SSL_ENABLED === "true";

const getDatabaseConfig = () => {
  const configs: Record<Environment, () => DatabaseConfig> = {
    development: getDevelopmentConfig,
    production: () => getProductionConfig(isSSLEnabled),
    test: getTestConfig,
  }
  return configs[environment as Environment]();
}

const dataSource = new DataSource(getDatabaseConfig() as DataSourceOptions);

export default dataSource;
