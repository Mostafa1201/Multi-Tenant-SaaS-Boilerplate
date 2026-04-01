import { TENANTS_DATA_PATH } from '../modules/common/constants';
import { Logger } from './logger';
import DailyRotateFile from 'winston-daily-rotate-file';
export class MasterLoggerService extends Logger {
  constructor() {
    super();
    this.logger.add(
      new DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `${TENANTS_DATA_PATH}/logs`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d'
      })
    );
  }
}
