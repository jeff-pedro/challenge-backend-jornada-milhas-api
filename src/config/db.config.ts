// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export default (): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   username: process.env.DB_USERNAME,
//   port: parseInt(`${process.env.DB_PORT}`, 10),
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [__dirname + '/../**/entities/*.entity{.js,.ts}'],
//   synchronize: true, // synchronize tables with entities - only for development
//   logging: true,
// });

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// @Injectable()
// export class PostgresConfigService implements TypeOrmOptionsFactory {
//   constructor(private configService: ConfigService) {}

//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'postgres',
//       host: this.configService.get<string>('db.host'),
//       port: this.configService.get<number>('db.port'),
//       username: this.configService.get<string>('db.username'),
//       password: this.configService.get<string>('db.password'),
//       database: this.configService.get<string>('db.name'),
//       entities: [__dirname + '/../**/entities/*.entity{.js,.ts}'],
//       logging: false,
//       synchronize: false,
//     };
//   }
// }

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.configService.get('db'),
    };
  }
}
