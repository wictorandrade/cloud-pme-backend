import { QUEUE_NAME } from '@config/queue.config';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import ms from 'ms';

@Injectable()
export class KeysRotationQueue implements OnModuleInit {
  private readonly logger = new Logger(KeysRotationQueue.name);

  constructor(@InjectQueue(QUEUE_NAME.ROTATE_KEYS) private queue: Queue) {}

  async onModuleInit() {
    this.logger.log('Inicializando agendador de rotação de chaves...');

    const jobId = `${QUEUE_NAME.ROTATE_KEYS}-first-run`;
    const existing = await this.queue.getJob(jobId);

    if (!existing) {
      this.logger.warn(
        'Nenhum job de rotação encontrado. Rodando imediatamente...',
      );
      await this.runFirstRotationImmediately();
    } else {
      this.logger.log('Job de rotação já registrado.');
    }
    //TODO: remover depois de resolver, precisa checar se tem algum kid ativo, se não tiver criar
    await this.runFirstRotationImmediately();

    await this.addRotationJob();
  }

  async runFirstRotationImmediately() {
    const jobId = `${QUEUE_NAME.ROTATE_KEYS}-first-run`;
    return this.queue.add(
      QUEUE_NAME.ROTATE_KEYS,
      {},
      {
        jobId,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  async addRotationJob() {
    const jobId = QUEUE_NAME.ROTATE_KEYS;

    await this.queue.add(
      jobId,
      {},
      {
        repeat: {
          every: ms('2d'),
        },
        jobId,
      },
    );

    this.logger.log(`Job de rotação agendado a cada 2 dias: ${jobId}`);
  }
}
