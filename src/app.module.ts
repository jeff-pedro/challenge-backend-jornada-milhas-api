import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { UsersModule } from './modules/users/users.module';
import { PhotosModule } from './modules/photos/photos.module';
import { DatabaseConfigService } from './config/db.config';
import configuration from './config/configuration';
import { validate } from './resources/validations/env.validation';
import { MainModule } from './main.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './resources/filters/http-exception.filters';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './config/app-options.constants';
import { HttpCacheInterceptor } from './resources/interceptors/http-cache.interceptor';
import { AuthModule } from './modules/auth/auth.module';

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
    CacheModule.registerAsync(RedisOptions),
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
    ConsoleLogger
  ],
})
export class AppModule {}