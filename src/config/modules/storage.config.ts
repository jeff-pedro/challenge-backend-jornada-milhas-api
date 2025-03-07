import { MulterModuleAsyncOptions } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StorageStrategy } from "./interfaces/storage-strategy.interface";
import { localStrategy, s3Strategy } from "./storage-strategies";

export const StorageConfig: MulterModuleAsyncOptions = {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const strategy: StorageStrategy = configService.get<string>('AWS_S3_ENABLE') === "true"
          ? s3Strategy
          : localStrategy;

          return {
            storage: strategy.getStorage(configService)
          }
        },
        inject: [ConfigService],
}
  