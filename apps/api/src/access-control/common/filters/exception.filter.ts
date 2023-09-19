import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.code ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const msg =
      exception instanceof HttpException
        ? exception.getResponse()['message'] ?? exception.getResponse()
        : exception.message ?? exception;
    response.status(status).json({
      statusCode: status,
      timestamp: Date.now(),
      path: request.url,
      error: msg,
    });
  }
}
