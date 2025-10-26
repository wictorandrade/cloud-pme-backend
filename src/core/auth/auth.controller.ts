import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IsPublic } from '@core/auth/decorators/is-public.decorator';
import type { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { UserPayload } from '@core/auth/auth.interfaces';
import { CurrentUser } from '@core/auth/decorators/current-user.decorator';
import { GoogleAuthGuard } from '@core/auth/guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() payload: UserPayload,
  ) {
    return this.authService.login(response, payload);
  }

  @Get('me')
  getMe(@CurrentUser() payload: UserPayload) {
    return payload;
  }

  @IsPublic()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() payload: UserPayload,
  ) {
    return this.authService.refresh(response, payload);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): void {
    this.authService.logout(response);
  }
  @IsPublic()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @IsPublic()
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async handleRedirect(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() payload: UserPayload,
  ) {
    await this.authService.login(response, payload);
    return response.redirect('http://localhost:3001');
  }
}
