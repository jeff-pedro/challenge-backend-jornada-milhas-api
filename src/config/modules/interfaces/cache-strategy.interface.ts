import { ConfigService } from "@nestjs/config";
import { CacheModuleOptions } from "@nestjs/cache-manager";


export interface CacheStrategy {
    /**
     * Creates a and returns a cache configuration based on the provided ConfigService
     * @param config NestJS ConfigService instance
     * @returns Promise with cache options for dynamic modules
     */
    createStore(config: ConfigService): Promise<CacheModuleOptions>;
}