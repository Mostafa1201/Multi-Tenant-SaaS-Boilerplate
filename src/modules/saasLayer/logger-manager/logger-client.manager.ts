import { Injectable } from '@nestjs/common';
import { TenantLogger } from '../../../logger/tenant-logger';
import { Logger } from '../../../logger/logger';

@Injectable()
export class LoggerClientManager {
  constructor(private readonly tenantLogger: TenantLogger) {}
  getClient(tenantId: string): Logger {
    return this.tenantLogger.getLogger(tenantId);
  }
}
