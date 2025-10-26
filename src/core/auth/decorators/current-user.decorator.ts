import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '@core/auth/auth.interfaces';

export const CurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();
    return request.userPayload as UserPayload;
  },
);
