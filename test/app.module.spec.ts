import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, ConsoleLogger, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinationsModule } from '../src/modules/destinations/destinations.module';
import { TestimonialsModule } from '../src/modules/testimonials/testimonials.module';
import { UsersModule } from '../src/modules/users/users.module';
import { PhotosModule } from '../src/modules/photos/photos.module';
import { DatabaseConfigService } from '../src/config/db.config';
import configuration from '../src/config/configuration';
import { validate } from '../src/resources/validations/env.validation';
import { MainModule } from '../src/main.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/resources/filters/http-exception.filters';
import { AuthModule } from '../src/modules/auth/auth.module';
import { EmptyLogger } from './empty-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
    TestimonialsModule,
    DestinationsModule,
    UsersModule,
    PhotosModule,
    AuthModule,
    MainModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: ConsoleLogger,
      useClass: EmptyLogger
    }
  ],
})
export class AppModuleTest {}