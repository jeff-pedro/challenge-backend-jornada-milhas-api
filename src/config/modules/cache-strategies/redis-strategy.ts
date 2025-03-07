import KeyvRedis from "@keyv/redis";
import { CacheModuleOptions } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { CacheStrategy } from "../interfaces/cache-strategy.interface";
import { CACHE_DEFAULTS } from "src/config/constants/app.constants";

export class RedisStrategy implements CacheStrategy {
  async createStore(config: ConfigService): Promise<CacheModuleOptions> {
    return {
        stores: [
          new KeyvRedis({
            socket: {
              host: config.get<string>('REDIS_HOST'),
              port: parseInt(config.get<string>('REDIS_PORT') ?? CACHE_DEFAULTS.PORT.toString())
            }
          })
        ],
        ttl: parseInt(config.get<string>('CACHE_TTL') ?? CACHE_DEFAULTS.TTL.toString()),
    }
  }
}