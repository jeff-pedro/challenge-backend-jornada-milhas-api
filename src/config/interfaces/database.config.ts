export interface DatabaseConfig {
    type: string;
    host?: string;
    username?: string;
    port?: number;
    password?: string;
    database:string;
    entities: string[],
    migrations: string[],
    synchronize?: boolean;
    logging?: boolean;
    ssl?: boolean | { ca: string }
    dropSchema?: boolean;
}
