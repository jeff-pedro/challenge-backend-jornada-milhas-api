export default () => {
  const environment = process.env.NODE_ENV || 'development';

  console.log(environment);

  const entities = [__dirname + '/../**/entities/*.entity{.js,.ts}'];

  type Environment = 'development' | 'production' | 'test';

  const environmentConfig: Record<Environment, any> = {
    development: {
      db: {
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(`${process.env.DB_PORT}`, 10) ?? 5432,
        username: process.env.DB_USERNAME ?? 'root',
        password: process.env.DB_PASSWORD ?? 'root',
        database: process.env.DB_NAME ?? 'jornadamilhas',
        entities,
        synchronize: true, // synchronize tables with entities - only for development
        logging: true,
      },
    },
    production: {
      db: {
        type: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        port: parseInt(`${process.env.DB_PORT}`, 10),
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities,
        synchronize: false, // never use synchronize: true in production - otherwise you can lose production data
        logging: false,
      },
    },
    test: {
      db: {
        type: 'sqlite',
        database: ':memory:',
        entities,
        dropSchema: true,
        synchronize: true, // synchronize tables with entities - only for development
        logging: false,
      },
    },
  };

  return {
    app: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      accessKeys: {
        cohereApiKey: process.env.COHERE_API_KEY,
      },
    },
    ...environmentConfig[environment as Environment],
  };
};
