import { CacheModuleOptions } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { CacheStrategy } from "../interfaces/cache-strategy.interface";
import { CACHE_DEFAULTS } from "src/config/constants/app.constants";

export class MemoryStrategy implements CacheStrategy {
  async createStore(config: ConfigService): Promise<CacheModuleOptions> {
    return {
      ttl: parseInt(config.get('CACHE_TTL') ?? CACHE_DEFAULTS.TTL.toString()),
      max: parseInt(config.get('CACHE_MAX_ITEMS') ?? CACHE_DEFAULTS.MAX_ITEMS.toString()),
    };
  }
}