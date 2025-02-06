import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";

const getRedisConfig = (configService: ConfigService) => ({
  socket: {
    host: configService.get<string>('REDIS_HOST'),
    port: parseInt(configService.get<string>('REDIS_PORT') ?? '6379')
  }, 
})

export const RedisOptions: CacheModuleAsyncOptions = {
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          new KeyvRedis(getRedisConfig(configService))
        ],
        ttl: parseInt(configService.get<string>('CACHE_TTL')!), // tempo de vida dos dados
      }),
    }
    