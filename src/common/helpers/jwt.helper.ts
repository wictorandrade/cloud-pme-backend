import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import jose from 'node-jose';
import ms from 'ms';
import { REDIS_COMMON_CONNECTION_KEY } from '@config/redis.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtHelper {
  constructor(
    @InjectRedis(REDIS_COMMON_CONNECTION_KEY) private readonly redis: Redis,
    readonly configService: ConfigService,
  ) {}

  decode(token: string) {
    const [headerB64] = token.split('.');
    return JSON.parse(Buffer.from(headerB64, 'base64').toString());
  }

  async verify<T>(token: string): Promise<T> {
    const { kid } = this.decode(token);
    const pemPub = await this.redis.get(`jwt:public:${kid}`);
    if (!pemPub) throw new Error(`Public key not found for kid ${kid}`);
    const key = await jose.JWK.asKey(pemPub, 'pem');
    const result = await jose.JWS.createVerify(key).verify(token);
    return JSON.parse(result.payload.toString()) as T;
  }
  async sign(
    payload: object,
    expiresIn: string,
    alg: 'RS256' | 'RS384' | 'RS512' = 'RS256',
  ): Promise<string> {
    const activeKid = await this.redis.get('jwt:active_kid');
    if (!activeKid) throw new Error('Active KID not set');

    const pemPriv = await this.redis.get(`jwt:private:${activeKid}`);
    if (!pemPriv) throw new Error('Private key not found for active kid');

    const key = await jose.JWK.asKey(pemPriv, 'pem');
    const now = Math.floor(Date.now() / 1000);
    const exp = now + Math.floor(ms(expiresIn as ms.StringValue) / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp,
      iss: this.configService.getOrThrow<string>('cookie.domain'),
    };

    const signer = jose.JWS.createSign(
      { format: 'compact', fields: { alg, kid: activeKid } },
      key,
    );

    signer.update(JSON.stringify(tokenPayload), 'utf8');
    return (await signer.final()) as unknown as string;
  }
}
