import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinationsModule } from './destinations/destinations.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { DatabaseConfigService } from './config/db.config';
import configuration from './config/configuration';
import { validate } from './validations/env.validation';
import { MainModule } from './main.module';

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
    TestimonialsModule,
    DestinationsModule,
    UsersModule,
    PhotosModule,
    MainModule,
  ],
})
export class AppModule {}
