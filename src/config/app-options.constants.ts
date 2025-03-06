import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModuleAsyncOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as fs from 'fs';
import { S3Client } from "@aws-sdk/client-s3";
import * as multerS3 from 'multer-s3';

const getRedisConfig = (configService: ConfigService) => ({
  socket: {
    host: configService.get<string>('REDIS_HOST'),
    port: parseInt(configService.get<string>('REDIS_PORT') ?? '6379')
  }, 
})

const getMulterS3StorageConfig = (configService: ConfigService) => (
  // console.log('OI'),
  multerS3({
    s3: new S3Client({
      region: configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') || ''
      }
    }),
    bucket: configService.get<string>('AWS_S3_BUCKET') || '',
    key: (req, file, cb) => {
      cb(null, Date.now().toString())
    }
  })
);

const getMulterDiskStorageConfig = (configService: ConfigService) => (
  diskStorage({
    destination: (req, file, cb) => {
      const { id } = req.params;
      const uploadPath = `${configService.get<string>('UPLOAD_DESTINATION_PATH')}/${id}`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
  })
);

export const RedisOptions: CacheModuleAsyncOptions = {
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          new KeyvRedis(getRedisConfig(configService))
        ],
        ttl: parseInt(configService.get<string>('CACHE_TTL')!),
      }),
      inject: [ConfigService],
    }

export const MulterOptions: MulterModuleAsyncOptions = {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          storage: configService.get<string>('AWS_S3_ENABLE') === "true"
          ? getMulterS3StorageConfig(configService)
          : getMulterDiskStorageConfig(configService)
        }),
        inject: [ConfigService],
}
