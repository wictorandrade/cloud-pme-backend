import { BullBoardModule } from '@bull-board/nestjs';
import { BULL_CONFIG_KEY, QUEUE_NAME } from '@config/queue.config';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { KeysRotationProcessor } from './keys-rotation.processor';
import { KeysRotationQueue } from './keys-rotation.queue';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.ROTATE_KEYS,
      configKey: BULL_CONFIG_KEY,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAME.ROTATE_KEYS,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [KeysRotationProcessor, KeysRotationQueue],
})
export class JobsModule {}
