import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    const databaseUrl = config.getOrThrow<string>('database.url');

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', (e: Prisma.QueryEvent) => {
      const duration =
        typeof e.duration === 'number'
          ? Number(e.duration.toFixed(3))
          : e.duration;
      this.logger.verbose(`Query: ${e.query} - Duration: ${duration} ms`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
