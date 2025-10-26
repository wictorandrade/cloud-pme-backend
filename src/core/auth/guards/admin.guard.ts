import {
  MetadataAdminRoute,
  ROLES_USER_KEY,
} from '@core/auth/decorators/admin-role.decorator';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '@core/auth/auth.interfaces';
import { UserUnauthorizedException } from '@core/auth/auth.exceptions';
import { UserRole } from '@generated/prisma/enums';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AdminGuard.name);
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const metadata = this.reflector.get<MetadataAdminRoute>(
      ROLES_USER_KEY,
      context.getHandler(),
    );

    const isAdminRoute = metadata?.isAdminRoute ?? false;

    const userPayload = req.userPayload as UserPayload;

    if (!isAdminRoute) {
      return true;
    }

    return this.validate(userPayload);
  }

  private validate(userPayload: UserPayload): boolean {
    if (userPayload.role === UserRole.ADMIN) {
      this.logger.verbose(`Rota de Admin chamada, admin: ${userPayload.email}`);
      return true;
    }

    this.logger.warn(
      `(User ID: ${userPayload.id}) não tem permissão para acessar a rota`,
      userPayload,
    );
    throw new UserUnauthorizedException();
  }
}
