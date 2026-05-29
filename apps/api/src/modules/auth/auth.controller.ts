import {
  Controller, Post, Body, Res, Req, HttpCode, HttpStatus, Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';

import { registerSchema, loginSchema } from '@repo/validation';
import { AuthService } from './auth.service';
import { ZodBody } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import type { JwtPayload } from './strategies/jwt.strategy';

const REFRESH_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  path: '/api/v1/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @ZodBody(registerSchema) body: ReturnType<typeof registerSchema.parse>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);
    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
    const { refreshToken: _rt, ...tokenResponse } = result;
    return { success: true, data: tokenResponse };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @ZodBody(loginSchema) body: ReturnType<typeof loginSchema.parse>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
    const { refreshToken: _rt, ...tokenResponse } = result;
    return { success: true, data: tokenResponse };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  async refresh(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = req.cookies[REFRESH_COOKIE] as string | undefined;
    if (!rawToken) {
      return { success: false, error: { code: 'AUTH_INVALID_TOKEN', message: 'No refresh token' } };
    }

    const result = await this.authService.refresh(user.sub, rawToken);
    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
    const { refreshToken: _rt, ...tokenResponse } = result;
    return { success: true, data: tokenResponse };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = req.cookies[REFRESH_COOKIE] as string | undefined;
    if (rawToken) {
      await this.authService.logout(user.sub, rawToken);
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth/refresh' });
    return { success: true, data: null };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@CurrentUser() user: JwtPayload) {
    return { success: true, data: { userId: user.sub, email: user.email } };
  }
}
