import { Injectable } from '@nestjs/common';
import { JwtTokenTooLargeException } from '@core/auth/auth.exceptions';

@Injectable()
export class AuthValidator {
  checkJwtTokenSize(jwtToken: string): void {
    if (Buffer.byteLength(jwtToken) / 1024 > 4) {
      throw new JwtTokenTooLargeException();
    }
  }
}
