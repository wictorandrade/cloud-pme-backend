import { RsaKeyHelper } from '@common/helpers/rsa-key.helper';
import { QUEUE_NAME } from '@config/queue.config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Redis } from 'ioredis';
import ms from 'ms';
import { REDIS_COMMON_CONNECTION_KEY } from '@config/redis.config';

@Injectable()
@Processor(QUEUE_NAME.ROTATE_KEYS)
export class KeysRotationProcessor extends WorkerHost {
  private readonly logger = new Logger(KeysRotationProcessor.name);

  constructor(
    @InjectRedis(REDIS_COMMON_CONNECTION_KEY)
    private readonly redisClient: Redis,
  ) {
    super();
  }

  async onModuleInit() {
    try {
      await this.redisClient.ping();
      this.logger.log('Conexão com Redis estabelecida com sucesso');
    } catch (error) {
      this.logger.error('Erro ao conectar no Redis', error.stack);
    }
  }

  async process(job: Job): Promise<void> {
    try {
      const { kid, privateKey, publicKey } =
        await RsaKeyHelper.generateKeyPair();

      const ttl = ms('2d');
      await this.redisClient.set('jwt:active_kid', kid);
      await this.redisClient.set(`jwt:private:${kid}`, privateKey, 'PX', ttl);
      await this.redisClient.set(`jwt:public:${kid}`, publicKey, 'PX', ttl);

      this.logger.log(
        `Chaves geradas e armazenadas com sucesso para o kid: ${kid}`,
      );

      this.logger.log(`Próximo job de rotação agendado para daqui a 2 dias.`);
    } catch (error) {
      this.logger.error('Erro ao gerar ou armazenar as chaves', error.stack);
    }
  }
}
