import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import type { RegisterDto, LoginDto, TokenResponse } from '@repo/validation';
import { ERROR_CODES } from '@repo/validation';
import { UsersRepository } from '../users/users.repository';
import { PrismaService } from '../../infra/prisma/prisma.service';
import type { ApiEnv } from '@repo/env';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly users: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<ApiEnv, true>,
  ) {}

  async register(dto: RegisterDto): Promise<TokenResponse> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException({
        code: ERROR_CODES.DB_CONFLICT,
        message: 'Email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.users.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    this.logger.info({ msg: 'User registered', userId: user.id });
    return this.generateTokenPair(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<TokenResponse & { refreshToken: string }> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        code: ERROR_CODES.AUTH_INVALID_TOKEN,
        message: 'Invalid credentials',
      });
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException({
        code: ERROR_CODES.AUTH_INVALID_TOKEN,
        message: 'Invalid credentials',
      });
    }

    const tokenPair = await this.generateTokenPair(user.id, user.email);
    this.logger.info({ msg: 'User logged in', userId: user.id });
    return tokenPair;
  }

  async refresh(userId: string, rawToken: string): Promise<TokenResponse & { refreshToken: string }> {
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!stored) {
      throw new UnauthorizedException({
        code: ERROR_CODES.AUTH_EXPIRED_TOKEN,
        message: 'Refresh token is invalid or expired',
      });
    }

    // Revoke old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.users.findByIdOrThrow(userId);
    return this.generateTokenPair(user.id, user.email);
  }

  async logout(userId: string, rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash },
      data: { revokedAt: new Date() },
    });
    this.logger.info({ msg: 'User logged out', userId });
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private async generateTokenPair(
    userId: string,
    email: string,
  ): Promise<TokenResponse & { refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      { expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN') },
    );

    const rawRefreshToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutes in seconds
      refreshToken: rawRefreshToken,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
