import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { UsersModule } from './modules/users/users.module';
import { PhotosModule } from './modules/photos/photos.module';
import { DatabaseConfigService } from './config/database/database-options.constants';
import configuration from './config/configuration';
import { validate } from './resources/validations/env.validation';
import { MainModule } from './main.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './resources/filters/http-exception.filters';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from './config/modules/cache.config';
import { HttpCacheInterceptor } from './resources/interceptors/http-cache.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalLoggerInterceptor } from './resources/interceptors/global-logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
    CacheModule.registerAsync(CacheConfig),
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
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalLoggerInterceptor
    },
    ConsoleLogger
  ],
})
export class AppModule {}