import { UnauthorizedException } from '@nestjs/common';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor(message = 'The refresh token is invalid.') {
    super(message);
  }
}

export class InvalidAccessTokenException extends UnauthorizedException {
  constructor(message = 'The access token is invalid.') {
    super(message);
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(message = 'Your credentials are invalid.') {
    super(message);
  }
}

export class JwtTokenTooLargeException extends UnauthorizedException {
  constructor(message = 'Login issue: token is too large.') {
    super(message);
  }
}

export class UserUnauthorizedException extends UnauthorizedException {
  constructor(message = 'User does not have permission to this action.') {
    super(message);
  }
}
