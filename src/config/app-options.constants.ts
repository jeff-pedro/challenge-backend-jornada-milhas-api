import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModuleAsyncOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as fs from 'fs';

const getRedisConfig = (configService: ConfigService) => ({
  socket: {
    host: configService.get<string>('REDIS_HOST'),
    port: parseInt(configService.get<string>('REDIS_PORT') ?? '6379')
  }, 
})

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
              storage: diskStorage({
                destination: (req, file, cb) => {
                  const { id } = req.params;
                  const uploadPath = `${configService.get<string>('UPLOAD_DESTINATION_PATH')}/${id}`;
          
                  if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                  }
          
                  cb(null, uploadPath);
                },
              })
        }),
        inject: [ConfigService],
}