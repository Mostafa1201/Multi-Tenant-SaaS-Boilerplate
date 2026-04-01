import { FactoryProvider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { LoggerClientManager } from '../logger-manager/logger-client.manager';
import { Logger } from '../../../logger/logger';
import { LoggerService } from '../../../logger/logger.service';

export interface ContextPayload {
  tenantId: string;
}

export const LoggerClientProvider: FactoryProvider<Logger> = {
  provide: LoggerService,
  scope: Scope.DEFAULT,
  durable: true,
  useFactory: (ctxPayload: ContextPayload, manager: LoggerClientManager) => {
    if (ctxPayload.tenantId) {
      return manager.getClient(ctxPayload.tenantId);
    }
  },
  inject: [REQUEST, LoggerClientManager]
};
