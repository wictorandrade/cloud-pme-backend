import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRedisHelper } from '@core/auth/auth-redis.helper';
import { AuthHelper } from '@core/auth/auth.helper';
import { InvalidRefreshTokenException } from '@core/auth/auth.exceptions';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtRefreshGuard.name);

  constructor(
    private readonly authHelper: AuthHelper,
    private readonly authRedisHelper: AuthRedisHelper,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const refreshToken = this.authHelper.extractTokenFromCookie(req, 'refresh');
    if (!refreshToken) throw new InvalidRefreshTokenException();

    try {
      await this.authRedisHelper.checkTokenBlacklisted(refreshToken);
      await this.authRedisHelper.addToBlacklist(refreshToken);

      req.userPayload = await this.authHelper.getUserPayloadFromCookie(
        req,
        'refresh',
      );
    } catch (error) {
      this.logger.error('Error verifying refresh token', error);
      throw new InvalidRefreshTokenException();
    }

    return true;
  }
}
