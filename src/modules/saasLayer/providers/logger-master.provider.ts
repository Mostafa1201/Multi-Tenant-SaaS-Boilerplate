import { FactoryProvider, Scope } from '@nestjs/common';
import { LoggerMasterManager } from '../logger-manager/logger-master.manager';
import { Logger } from '../../../logger/logger';
import { LOGGER_MASTER_PROVIDER } from '../../common/constants';

export interface ContextPayload {
  tenantId: string;
}

export const LoggerMasterProvider: FactoryProvider<Logger> = {
  provide: LOGGER_MASTER_PROVIDER,
  scope: Scope.DEFAULT,
  useFactory: (manager: LoggerMasterManager) => {
    return manager.getClient();
  },
  inject: [LoggerMasterManager]
};
