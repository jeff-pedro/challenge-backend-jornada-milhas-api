import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { Photo } from '../photos/entities/photo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import * as fs from 'fs'

@Module({
  imports: [
    TypeOrmModule.forFeature([Destination, Photo]),
    // TODO: refatorar, colocando essas opções em arquivo de config
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
            storage: diskStorage({
              destination: (req, file, cb) => {
                const { id } = req.params;
                const uploadPath = `upload/destinations/${id}`;
        
                if (!fs.existsSync(uploadPath)) {
                  fs.mkdirSync(uploadPath, { recursive: true });
                }
        
                cb(null, uploadPath);
              },
            })
      }),
      inject: [ConfigService],
    })
  ],
  providers: [DestinationsService],
  controllers: [DestinationsController],
})
export class DestinationsModule {}
