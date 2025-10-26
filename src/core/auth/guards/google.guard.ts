import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);
  constructor() {
    super({ session: false });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
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
