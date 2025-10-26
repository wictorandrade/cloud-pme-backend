import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms, { StringValue } from 'ms';
import { JwtVerifyOptions } from '@nestjs/jwt';
import { InvalidAccessTokenException } from '@core/auth/auth.exceptions';
import { JwtHelper } from '@common/helpers/jwt.helper';
import { JwtSignedFields, UserPayload } from '@core/auth/auth.interfaces';

@Injectable()
export class AuthHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  createCookieOfToken(
    response: Response,
    token: string,
    type: 'access' | 'refresh',
  ) {
    const expiration = this.configService.getOrThrow<StringValue>(
      type === 'access' ? 'jwt.access.expiresIn' : 'jwt.refresh.expiresIn',
    );
    const expiresMs = ms(expiration);

    if (type === 'access') {
      this.createAcessTokenCookie(response, token, expiresMs);
    } else {
      this.createRefreshTokenCookie(response, token, expiresMs);
    }
  }

  extractTokenFromCookie(
    req: Request,
    type: 'access' | 'refresh',
  ): string | null {
    const tokenCookieName =
      type === 'access'
        ? this.configService.getOrThrow<string>('jwt.access.cookieName')
        : this.configService.getOrThrow<string>('jwt.refresh.cookieName');

    if (!tokenCookieName) {
      throw new Error(`Cookie name for ${type} is missing in config`);
    }

    return req?.cookies ? req.signedCookies[tokenCookieName] : null;
  }

  clearCookiesOfToken(response: Response) {
    this.createAcessTokenCookie(response, '', 0);
    this.createRefreshTokenCookie(response, '', 0);
  }

  async getUserPayloadFromCookie(
    request: Request,
    type: 'access' | 'refresh',
    jwtVerifyOptions?: JwtVerifyOptions,
  ): Promise<UserPayload> {
    const token = this.extractTokenFromCookie(request, type);
    if (!token) throw new InvalidAccessTokenException();

    try {
      const jwtSignedFields =
        await this.jwtHelper.verify<JwtSignedFields>(token);

      return this.mapJwtSignedFiledsToUserPayload(jwtSignedFields);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  mapJwtSignedFiledsToUserPayload(
    jwtSignedFields: JwtSignedFields,
  ): UserPayload {
    return {
      id: jwtSignedFields.id,
      email: jwtSignedFields.email,
      displayName: jwtSignedFields.displayName,
      firstName: jwtSignedFields.firstName,
      lastName: jwtSignedFields.lastName,
      avatarUrl: jwtSignedFields.avatarUrl,
      role: jwtSignedFields.role,
    };
  }

  private createRefreshTokenCookie(
    response: Response,
    value: string,
    expiresMs: number,
  ) {
    const cookieTokenName = this.configService.getOrThrow<string>(
      'jwt.refresh.cookieName',
    );
    const domain = this.configService.getOrThrow<string>('cookie.domain');
    const secure = this.configService.getOrThrow<boolean>('cookie.secure');

    if (!cookieTokenName || !domain) {
      throw new Error('Cookie configuration is missing');
    }

    response.cookie(cookieTokenName, value, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      domain,
      signed: true,
      maxAge: expiresMs,
    });
  }

  private createAcessTokenCookie(
    response: Response,
    value: string,
    expiresMs: number,
  ) {
    const cookieTokenName = this.configService.getOrThrow<string>(
      'jwt.access.cookieName',
    );
    const domain = this.configService.getOrThrow<string>('cookie.domain');
    const secure = this.configService.getOrThrow<boolean>('cookie.secure');

    if (!cookieTokenName || !domain) {
      throw new Error('Cookie configuration is missing');
    }

    response.cookie(cookieTokenName, value, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      domain: domain,
      signed: true,
      maxAge: expiresMs,
    });
  }
}
