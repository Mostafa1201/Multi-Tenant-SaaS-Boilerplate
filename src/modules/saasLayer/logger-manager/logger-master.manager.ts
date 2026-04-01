import { Injectable } from '@nestjs/common';
import { MasterLoggerService } from '../../../logger/master-logger.service';

@Injectable()
export class LoggerMasterManager {
  private masterClient: MasterLoggerService | undefined;

  constructor() {
    this.masterClient = new MasterLoggerService();
  }

  getClient(): MasterLoggerService {
    return this.masterClient;
  }
}
