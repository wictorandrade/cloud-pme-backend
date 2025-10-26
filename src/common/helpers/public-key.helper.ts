import { REDIS_COMMON_CONNECTION_KEY } from '@config/redis.config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import jose from 'node-jose';

export class PublicKeyHelper {
  constructor(
    @InjectRedis(REDIS_COMMON_CONNECTION_KEY) private readonly redis: Redis,
  ) {}

  async listJwks(): Promise<any[]> {
    const pattern = 'jwt:public:*';
    const keys: string[] = [];
    let cursor = '0';
    do {
      const [nextCursor, results] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        '100',
      );
      cursor = nextCursor;
      keys.push(...results);
    } while (cursor !== '0');

    if (keys.length === 0) return [];
    const pems = await this.redis.mget(...keys);

    return Promise.all(
      pems.map(async (pem, idx) => {
        if (!pem) throw new Error(`Public key missing for key ${keys[idx]}`);
        const key = await jose.JWK.asKey(pem, 'pem');
        return key.toJSON();
      }),
    );
  }

  async loadPublicKeyFromRedis(kid: string): Promise<string> {
    const pem = await this.redis.get(`jwt:public:${kid}`);
    if (!pem) throw new Error(`Public key not found for kid: ${kid}`);
    return pem;
  }
}
