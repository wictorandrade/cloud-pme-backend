import { AllExceptionsFilter } from '@core/filters/all-exceptions.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { getCustomLogger, useRequestLogging } from '@global/setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: getCustomLogger('APP'),
  });
  useRequestLogging(app);
  app.setGlobalPrefix('ecoa/v1');

  const configService = app.get(ConfigService);
  const cookieSecret = configService.getOrThrow<string>('cookie.secret');
  const port = configService.getOrThrow<number>('port');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  app.use(compression());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.use(cookieParser(cookieSecret));

  const host = '0.0.0.0';

  await app.listen(port, host);
  Logger.log(
    `Application is running on: http://${host}:${port}/ecoa/v1`,
    'Bootstrap',
  );
}

bootstrap();
