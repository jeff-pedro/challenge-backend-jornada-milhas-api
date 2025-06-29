import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Cache } from "cache-manager";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest()
    const isCacheEnabled = this.configService.get<boolean>('CACHE_ENABLED');
    const isGetRequest = request.method === 'GET';

    if (!isGetRequest || !isCacheEnabled) {
      return undefined;
    }

    const url = request.originalUrl || request.url;
    const [_, endpoint, id] = url.split('/');

    return id ? `${endpoint}-${id}` : endpoint;
  }
}
