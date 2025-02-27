import { readFileSync } from "fs";
import { DatabaseConfig } from "../interfaces/database.config";
import { join } from "path";

const entities = [__dirname + '/../../modules/**/entities/*.entity{.js,.ts}'];

export const getDevelopmentConfig = (): DatabaseConfig => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(`${process.env.DB_PORT}`, 10) ?? 5432,
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'root',
    database: process.env.DB_NAME ?? 'jornadamilhas',
    entities,
    synchronize: true, // synchronize tables with entities - only for development
    logging: true,
});

export const getProductionConfig = (isSSLEnabled: boolean): DatabaseConfig => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    port: parseInt(`${process.env.DB_PORT}`, 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'jornadamilhas',
    entities,
    synchronize: false, // never use synchronize: true in production - otherwise you can lose production data
    logging: false,
    ssl: isSSLEnabled
    ? process.env.DB_SSL_CA_PATH
      ? { ca: readFileSync(join(__dirname, '../../', String(process.env.DB_SSL_CA_PATH))).toString() }
      : true
    : false,
})

export const getTestConfig = (): DatabaseConfig => ({
    type: 'sqlite',
    database: ':memory:',
    entities,
    dropSchema: true,
    synchronize: true,
    logging: false,
})

