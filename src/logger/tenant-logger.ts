import { Injectable } from '@nestjs/common';
import { TenantLoggerService } from './tenant-logger.service';
import { Logger } from './logger';

@Injectable()
export class TenantLogger {
  private static _instance: TenantLogger;

  public static getInstance(): TenantLogger {
    if (!this._instance) {
      TenantLogger._instance = new TenantLogger();
    }
    return TenantLogger._instance;
  }

  private setLogger(tenantCode: string, logger?: Logger) {
    TenantLogger._instance[tenantCode] = logger;
  }

  getLogger(tenantCode: string): Logger {
    if (!TenantLogger._instance[tenantCode]) {
      this.setLogger(tenantCode, new TenantLoggerService(tenantCode));
    }
    return TenantLogger._instance[tenantCode];
  }
}
