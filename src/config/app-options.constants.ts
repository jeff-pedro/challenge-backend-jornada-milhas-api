import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";

const redisOptions = {
    socket: {
        host: 'localhost',
        port: 6379

    },
}

export const RedisOptions: CacheModuleAsyncOptions = {
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new KeyvRedis(redisOptions)
          ],
          ttl: 10 * 1000, // tem de vida dos dados de 10 segundos,
        }
      }
    }