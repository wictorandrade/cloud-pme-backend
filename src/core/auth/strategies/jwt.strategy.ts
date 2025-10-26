import { JwtHelper } from '@common/helpers/jwt.helper';
import { PublicKeyHelper } from '@common/helpers/public-key.helper';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '@core/auth/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtHelper: JwtHelper,
    private readonly publicKeyHelper: PublicKeyHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const name = configService.getOrThrow<string>(
            'jwt.access.cookieName',
          );
          if (!name)
            throw Error('cookie name not defined, please adjusts configs');
          return req.cookies?.[name] || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        req: Request,
        token: string,
        done: (err: Error | null, key?: string | Buffer) => void,
      ) => {
        try {
          const { kid } = this.jwtHelper.decode(token);
          this.publicKeyHelper
            .loadPublicKeyFromRedis(kid)
            .then((key) => done(null, key))
            .catch((err) => done(err));
        } catch (err) {
          done(err as Error);
        }
      },
    });
  }

  validate(payload: UserPayload): UserPayload {
    return payload;
  }
}
