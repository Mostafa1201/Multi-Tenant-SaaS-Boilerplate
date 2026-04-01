import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { LOGGER_MASTER_PROVIDER } from '../modules/common/constants';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_MASTER_PROVIDER)
    private loggerService: LoggerService
  ) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as HttpException).message || JSON.stringify(errorResponse);
    } else if (exception instanceof Error) {
      message = exception.message || 'An unexpected error occurred';
      this.loggerService.error(`Unhandled exception: ${exception.stack}`);
    } else if (typeof exception === 'string') {
      message = exception;
    } else if (typeof exception === 'object' && exception !== null) {
      if (Array.isArray(exception.errors)) {
        const errors = exception.errors.map((err: unknown) => {
          if (err instanceof Error) {
            return err.message;
          }
          return JSON.stringify(err);
        });
        message = errors.join(', ');
      } else {
        message = JSON.stringify(exception);
      }
    }

    this.loggerService.error(
      `[${timestamp}] Exception caught: ${message}, Status code: ${status}, Path: ${request.url}`
    );
    response.status(status).json({
      statusCode: status,
      message,
      timestamp,
      method: request.method,
      path: request.url
    });
  }
}
