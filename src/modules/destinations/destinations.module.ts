import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { Photo } from '../photos/entities/photo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '../../config/app-options.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destination, Photo]),
    MulterModule.registerAsync(MulterOptions)
  ],
  providers: [DestinationsService],
  controllers: [DestinationsController],
})
export class DestinationsModule {}
