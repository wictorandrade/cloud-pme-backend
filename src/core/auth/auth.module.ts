import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '@common/common.module';
import { UserModule } from '../user/user.module';
import { AuthRedisHelper } from './auth-redis.helper';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { AuthValidator } from './auth.validator';
import { JwtAccessGuard } from '@core/auth/guards/jwt-access.guard';
import { JwtStrategy } from '@core/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@core/auth/strategies/local.strategy';
import { AdminGuard } from '@core/auth/guards/admin.guard';
import { GoogleStrategy } from '@core/auth/strategies/google.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.getOrThrow<string>('jwt.access.expiresIn'),
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.getOrThrow<string>('jwt.refresh.expiresIn'),
        },
      }),
    }),
    CommonModule,
    ConfigModule,
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    AuthValidator,
    AuthRedisHelper,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
  exports: [AuthService, AuthHelper],
})
export class AuthModule {}
