import { CallHandler, ConsoleLogger, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRequest } from 'src/modules/auth/auth.guard';

@Injectable()
export class GlobalLoggerInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest< Request | UserRequest >()
    const response = context.switchToHttp().getResponse< Response >()
    
    const featureName = context.getClass().name;

    const preControllerMoment = Date.now();
    const { method, path } = request;
    const { statusCode } = response;

    if ('user' in request == false) {
      this.logger.log(`Accessed {${path}, ${method}} public route`, featureName);
    }

    return next
      .handle()
      .pipe(
        tap(() => {
          if ('user' in request) {
            this.logger.log(`Route accessed by user: ${ request.user.sub }`, featureName);
          }
          const responseTime = Date.now() - preControllerMoment;
          this.logger.log(`Response status ${statusCode} - response time: ${responseTime}ms`, featureName);
        })
      );
  }
}
