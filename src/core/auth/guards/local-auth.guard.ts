import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err) {
      this.logger.error('Erro no processo de autenticação:', err);
    }

    if (err || !user) {
      throw err || new UnauthorizedException('email ou senha inválidos');
    }

    const request = context.switchToHttp().getRequest();

    request.userPayload = user;

    return user;
  }
}
