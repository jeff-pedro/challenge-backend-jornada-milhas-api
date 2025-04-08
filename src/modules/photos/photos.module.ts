import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { GeminiService } from '../destinations/services/gemini.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  controllers: [PhotosController],
  providers: [
    PhotosService,
    {
      provide: 'IAService',
      useClass: GeminiService,
    }
  ]
})
export class PhotosModule { }
