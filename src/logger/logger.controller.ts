import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { promises as fs } from 'fs';
import { REQUEST } from '@nestjs/core';
import { IsLogCallerAuthorized } from './guards/isLogCallerAuthorized.guard';
import { getTodayLogFileName } from './utils/logger-utils';
import { TENANTS_DATA_PATH } from '../modules/common/constants';

@ApiTags('logs')
@Controller('logs')
@UseGuards(IsLogCallerAuthorized)
export class LoggerController {
  constructor(
    @Inject(REQUEST)
    private readonly request
  ) {}

  @Get()
  @ApiOperation({ summary: 'get today error logs from error.log file' })
  @ApiResponse({ status: 200, description: 'Logs returned successfully' })
  async getTodayLogs() {
    try {
      const tenantCode = this.request.tenantId;
      const logFileName = getTodayLogFileName();
      const filePath = `${TENANTS_DATA_PATH}/${tenantCode}/logs/${logFileName}`;
      const errorsLogFile = await fs.readFile(filePath, 'utf8');
      return errorsLogFile;
    } catch (error: any) {
      return error.message;
    }
  }
}
