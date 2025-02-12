import { CacheInterceptor } from "@nestjs/cache-manager";
import { ExecutionContext, HttpServer, Injectable } from "@nestjs/common";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest()
    const isGetRequest = request.method === 'GET';

    if (!isGetRequest) {
      return undefined;
    }

    const url = request.originalUrl || request.url;
    const [_, endpoint, id] = url.split('/');

    return id ? `${endpoint}-${id}` : endpoint;
  }
}
