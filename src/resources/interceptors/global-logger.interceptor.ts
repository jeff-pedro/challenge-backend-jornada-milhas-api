import { CallHandler, ConsoleLogger, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRequest } from 'src/modules/auth/auth.guard';

@Injectable()
export class GlobalLoggerInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest< Request | UserRequest >()
    return next
      .handle()
      .pipe(
        tap(() => {
          if ('user' in request) {
            this.logger.log(`Route accessed by user: ${ request.user.sub }`)
          }
        })
      );
  }
}
