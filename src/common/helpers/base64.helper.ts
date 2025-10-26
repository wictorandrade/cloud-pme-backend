import { Injectable } from '@nestjs/common';

@Injectable()
export class Base64Helper {
  encode(text: string, encoding?: BufferEncoding): string {
    return Buffer.from(text, encoding).toString('base64');
  }

  decode(text: string, encoding: BufferEncoding = 'ascii'): string {
    return Buffer.from(text, 'base64').toString(encoding);
  }
}
