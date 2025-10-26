import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@generated/prisma/client';
import { ThrottlerException } from '@nestjs/throttler';

type ExceptionInfo = {
  statusCode: number;
  message: string | string[];
  error?: string;
  code?: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly DATABASE_KNOWN_REQUEST_ERROR =
    'Erro conhecido do banco de dados';
  private readonly DATABASE_UNKNOWN_REQUEST_ERROR =
    'Erro desconhecido do banco de dados';

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const requestPath = httpAdapter.getRequestUrl(request);
    const requestMethod = httpAdapter.getRequestMethod(request);

    let httpExceptionInfo = this.extractHttpExceptionInfo(
      new InternalServerErrorException(),
    );

    if (exception instanceof ThrottlerException) {
      const status = exception.getStatus();
      httpExceptionInfo = {
        statusCode: status,
        message:
          'Muitas solicitações em um curto período de tempo. Por favor, tente novamente mais tarde.',
        error: 'Too Many Requests',
        code: 'TOO_MANY_REQUESTS',
      };
      this.logger.log(
        `Throttled: {path=${requestPath}, method=${requestMethod}, status=${status}}`,
      );
    } else if (exception instanceof HttpException) {
      httpExceptionInfo = this.extractHttpExceptionInfo(exception);
      this.logger.log(
        `HTTP - ${httpExceptionInfo.error} {${requestPath}, ${requestMethod}, ${httpExceptionInfo.statusCode}}`,
      );
      this.logger.warn(exception.message, exception.stack);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.warn(exception.message, exception.stack);
      httpExceptionInfo = this.extractHttpExceptionInfo(
        new BadRequestException(this.DATABASE_KNOWN_REQUEST_ERROR),
      );
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      this.logger.warn(exception.message, exception.stack);
      httpExceptionInfo = this.extractHttpExceptionInfo(
        new BadRequestException(this.DATABASE_UNKNOWN_REQUEST_ERROR),
      );
    } else if (exception instanceof UnauthorizedException) {
      this.logger.warn(exception.message, exception.stack);
      httpExceptionInfo = this.extractHttpExceptionInfo(
        new BadRequestException(this.DATABASE_UNKNOWN_REQUEST_ERROR),
      );
    }

    const responseBodyExtra = {
      timestamp: new Date().toISOString(),
      path: requestPath,
    };

    if (httpExceptionInfo.statusCode >= 500) {
      this.logger.error(exception.message, exception.stack);
      httpExceptionInfo = {
        statusCode: 500,
        message: 'Erro desconhecido. Contate um administrador',
      };
    }

    const responseBody = {
      ...responseBodyExtra,
      ...httpExceptionInfo,
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      httpExceptionInfo.statusCode,
    );
  }

  private extractHttpExceptionInfo(exception: HttpException): ExceptionInfo {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        statusCode: exception.getStatus(),
        message: response,
        error: exception.name,
      };
    }

    const baseResponse = response as ExceptionInfo;

    return {
      statusCode: baseResponse.statusCode ?? exception.getStatus(),
      message: baseResponse.message,
      error: baseResponse.error ?? exception.name,
    };
  }
}
