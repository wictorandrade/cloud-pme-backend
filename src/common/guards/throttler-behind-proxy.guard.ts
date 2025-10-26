import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpHelper } from '../helpers/http.helper';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // Precisa ser async por causa da assinatura do ThrottlerGuard, mesmo sem await
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const httpHelper = new HttpHelper();
    return httpHelper.getIP(req);
  }
}
