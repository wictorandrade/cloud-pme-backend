import { REDIS_COMMON_CONNECTION_KEY } from '@config/redis.config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import ms from 'ms';
import { InvalidRefreshTokenException } from '@core/auth/auth.exceptions';

@Injectable()
export class AuthRedisHelper {
  constructor(
    @InjectRedis(REDIS_COMMON_CONNECTION_KEY) private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  async checkTokenBlacklisted(token: string) {
    const key = `blacklist:${token}`;
    const blacklisteds = await this.redis.exists(key);
    const isBlacklisted = blacklisteds === 1;

    if (isBlacklisted) throw new InvalidRefreshTokenException();
  }

  async addToBlacklist(token: string): Promise<void> {
    const key = `blacklist:${token}`;
    const ttl = this.configService.getOrThrow<number>('jwt.refresh.expiresIn');
    await this.redis.set(key, 'blacklisted', 'PX', ms(ttl));
  }
}
