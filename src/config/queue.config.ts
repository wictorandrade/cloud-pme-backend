import { SharedBullAsyncConfiguration } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

export const BullConfig: SharedBullAsyncConfiguration = {
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.getOrThrow<string>('redis.bullmq.host'),
      port: configService.getOrThrow<number>('redis.bullmq.port'),
      password: configService.getOrThrow<string>('redis.bullmq.password'),
      db: configService.getOrThrow<number>('redis.bullmq.db'),
    },
  }),
  inject: [ConfigService],
};

export const BULL_CONFIG_KEY = 'local-bullmq';

export const QUEUE_NAME = {
  ROTATE_KEYS: 'rotate-keys',
};

export const QUEUE_NAME_ALL = Object.freeze({ ...QUEUE_NAME });

export type QueueNameAll = (typeof QUEUE_NAME_ALL)[keyof typeof QUEUE_NAME_ALL];
