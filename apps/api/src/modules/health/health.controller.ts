import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

import { PrismaService } from '../../infra/prisma/prisma.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('healthz')
  @ApiOperation({ summary: 'Liveness check — is the process alive?' })
  liveness() {
    return { status: 'ok', uptime: Math.floor(process.uptime()) };
  }

  @Get('readyz')
  @ApiOperation({ summary: 'Readiness check — is the app ready to serve traffic?' })
  async readiness(@Res() res: Response) {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return res.status(HttpStatus.OK).json({ status: 'ok', db: 'connected' });
    } catch {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        db: 'disconnected',
      });
    }
  }
}
