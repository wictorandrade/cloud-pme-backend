import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashHelper {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  async compare(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}
