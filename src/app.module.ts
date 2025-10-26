import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { CommonModule } from '@common/common.module';
import { ThrottlerBehindProxyGuard } from '@common/guards/throttler-behind-proxy.guard';
import { configuration } from '@config/app.config';
import { envSchema } from '@config/env.validation';
import { BULL_CONFIG_KEY, BullConfig } from '@config/queue.config';
import { REDIS_COMMON_CONNECTION_KEY, RedisConfig } from '@config/redis.config';
import { AuthModule } from '@core/auth/auth.module';
import { ExternalServiceAuthMiddleware } from '@core/auth/middlewares/external-service-auth.middleware';
import { PrismaModule } from '@core/prisma/prisma.module';
import { getRedisConnectionToken, RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import ms from 'ms';
import { HealthController } from '@/health.controller';
import { JobsModule } from '@jobs/jobs.module';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: envSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [getRedisConnectionToken(REDIS_COMMON_CONNECTION_KEY)],
      useFactory: (redisClient: Redis) => {
        return {
          throttlers: [
            { name: 'short', ttl: ms('1s'), limit: 5 },
            { name: 'medium', ttl: ms('10s'), limit: 30 },
            { name: 'long', ttl: ms('1m'), limit: 100 },
          ],
          storage: new ThrottlerStorageRedisService(redisClient),
        };
      },
    }),
    RedisModule.forRootAsync(RedisConfig, REDIS_COMMON_CONNECTION_KEY),
    BullModule.forRootAsync(BULL_CONFIG_KEY, BullConfig),
    BullBoardModule.forRootAsync({
      useFactory: () => ({
        route: '/queues',
        adapter: ExpressAdapter,
        middleware: ExternalServiceAuthMiddleware,
      }),
      imports: [AuthModule],
    }),
    TerminusModule.forRoot({
      errorLogStyle: 'json',
    }),
    PrismaModule,
    CommonModule,
    JobsModule,
    HttpModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
  controllers: [HealthController],
})
export class AppModule {}
