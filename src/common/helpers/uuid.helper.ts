import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class UUIDHelper {
  generate(): string {
    return randomUUID();
  }
}
