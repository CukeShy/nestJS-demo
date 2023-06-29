import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((res) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        const { success, message, data = {}, list = [] } = res;

        return {
          code: response.statusCode,
          success: success,
          message: message,
          object: data,
          list: list,
        };
      }),
    );
  }
}
