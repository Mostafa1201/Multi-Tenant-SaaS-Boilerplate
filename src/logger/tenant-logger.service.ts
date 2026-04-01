import { Injectable } from '@nestjs/common';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Logger } from './logger';
import { TENANTS_DATA_PATH } from '../modules/common/constants';
@Injectable()
export class TenantLoggerService extends Logger {
  constructor(private tenantCode: string) {
    super();
    this.logger.add(
      new DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `${TENANTS_DATA_PATH}/${this.tenantCode}/logs`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d'
      })
    );
  }
}
