import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message_cn = '';
    switch (status) {
      case 401:
        message_cn = '未登录, 请登录后再试';
        break;
      case 403:
        message_cn = '禁止访问';
    }

    response.status(status).json({
      code: status,
      success: false,
      message: message_cn,
      object: {},
      list: [],
    });
  }
}
