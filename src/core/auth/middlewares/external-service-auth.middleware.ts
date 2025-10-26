import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthHelper } from '@core/auth/auth.helper';
import { UserUnauthorizedException } from '@core/auth/auth.exceptions';
import { UserRole } from '@generated/prisma/enums';

@Injectable()
export class ExternalServiceAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ExternalServiceAuthMiddleware.name);

  constructor(private readonly authHelper: AuthHelper) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const user = await this.authHelper.getUserPayloadFromCookie(
        req,
        'access',
      );

      if (user.role !== UserRole.ADMIN) {
        this.unauthorized();
      }
      this.logger.verbose('Admin request for External Service.');
      next();
    } catch (e) {
      this.logger.error(
        'Erro ao autenticar usuário para acesso ao serviço externo',
        e,
      );
      this.unauthorized();
    }
  }

  private unauthorized() {
    throw new UserUnauthorizedException();
  }
}
