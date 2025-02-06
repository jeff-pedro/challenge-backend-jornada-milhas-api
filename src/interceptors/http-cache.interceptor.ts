import { CacheInterceptor } from "@nestjs/cache-manager";
import { ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const { url } = context.getArgs()[0];
    const [_, endpoint, id] = url.split('/')
    return `${endpoint}-${id}`;
  }
}
