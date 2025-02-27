import { Environment, EnvironmentConfig } from "./interfaces/environment.config";
import { AppConfig } from "./interfaces/app.config";
import { getDevelopmentConfig, getProductionConfig, getTestConfig } from './database/database.config';
import { DatabaseConfig } from "./interfaces/database.config";

export default (): EnvironmentConfig => {
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

  const getAppConfig = (): AppConfig => ({
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    accessKeys: {
      geminiApiKey: process.env.GEMINI_API_KEY,
    },
  });

  return {
    app: getAppConfig(),
    db: getDatabaseConfig(),
  };
};
