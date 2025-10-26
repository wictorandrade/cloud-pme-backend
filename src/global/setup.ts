import {
  ConsoleLogger,
  INestApplication,
  Logger,
  LogLevel,
} from '@nestjs/common';
import morgan from 'morgan';

const allLogLevels: LogLevel[] = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
  'fatal',
];
const defaultMaxLogLevel = 'debug';

function getLogLevel(): LogLevel[] {
  let maxLogLevel = String(process.env.LOG_LEVEL || defaultMaxLogLevel)
    .trim()
    .toLowerCase() as LogLevel;
  const hasLogLevel = allLogLevels.includes(maxLogLevel);
  if (!hasLogLevel) {
    maxLogLevel = defaultMaxLogLevel;
  }
  return allLogLevels.slice(
    allLogLevels.indexOf(maxLogLevel),
    allLogLevels.length,
  );
}

function getLogJson() {
  const isJson = String(process.env.LOG_JSON || 'false')
    .trim()
    .toLowerCase();
  return isJson === 'true' || isJson === '1';
}

export function getCustomLogger(prefix: string): ConsoleLogger {
  return new ConsoleLogger(prefix, {
    logLevels: getLogLevel(),
    json: getLogJson(),
    prefix,
  });
}

export function useRequestLogging(app: INestApplication) {
  const logger = new Logger('Request');
  app.use(
    morgan('tiny', {
      stream: {
        write: (message) => logger.log(message.replace('\n', '')),
      },
    }),
  );
}
