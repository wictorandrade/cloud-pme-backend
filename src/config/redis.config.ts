import { RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

export const RedisConfig: RedisModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    const host = configService.getOrThrow<string>('redis.common.host');
    const port = configService.getOrThrow<number>('redis.common.port');
    const password = configService.getOrThrow<string>('redis.common.password');
    const db = configService.getOrThrow<number>('redis.common.db');

    const redisUrl = `redis://${host}:${port}`;
    return {
      type: 'single',
      url: redisUrl,
      options: {
        password,
        db,
      },
    };
  },
  inject: [ConfigService],
};

export const REDIS_COMMON_CONNECTION_KEY = 'common-redis';
