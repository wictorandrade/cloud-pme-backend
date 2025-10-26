import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@core/auth/decorators/is-public.decorator';
import { AuthHelper } from '@core/auth/auth.helper';
import { InvalidAccessTokenException } from '@core/auth/auth.exceptions';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAccessGuard.name);
  constructor(
    private reflector: Reflector,
    private readonly authHelper: AuthHelper,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    try {
      req.userPayload = await this.authHelper.getUserPayloadFromCookie(
        req,
        'access',
      );
    } catch (e) {
      this.logger.error(e);
      throw new InvalidAccessTokenException();
    }

    return true;
  }
}
