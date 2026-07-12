import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string | undefined = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseBody = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };

        if (Array.isArray(responseBody.message)) {
          message = responseBody.message.join(', ');
        } else if (responseBody.message) {
          message = responseBody.message;
        }

        error = responseBody.error;
      }
    }

    const body: ApiErrorResponse = {
      message,
      statusCode,
      ...(error ? { error } : {}),
    };

    response.status(statusCode).json(body);
  }
}
