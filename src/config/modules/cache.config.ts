import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheStrategy } from "./interfaces/cache-strategy.interface";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { RedisStrategy, MemoryStrategy } from "./cache-strategies";


const getCacheStrategy = async (config: ConfigService): Promise<CacheStrategy> => {
    const useRedis = config.get<string>('CACHE_STRATEGY') === 'redis';
    return useRedis ? new RedisStrategy() : new MemoryStrategy();
  }
  
  export const CacheConfig: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const strategy = await getCacheStrategy(configService);
      return strategy.createStore(configService);
  },
  inject: [ConfigService],
}
