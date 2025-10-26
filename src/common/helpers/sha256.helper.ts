// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class Sha256Helper {
  hash(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }

  compare(data: string, hash: string): boolean {
    const hashedData = this.hash(data);
    return hashedData === hash;
  }
}
