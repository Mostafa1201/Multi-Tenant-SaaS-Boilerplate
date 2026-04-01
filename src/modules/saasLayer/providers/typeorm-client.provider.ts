import { FactoryProvider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { TypeOrmClientManager } from '../typeorm-manager/typeorm-client.manager';

export interface ContextPayload {
  tenantId: string;
}

export const TypeOrmClientProvider: FactoryProvider<DataSource> = {
  provide: DataSource,
  scope: Scope.DEFAULT,
  durable: true,
  useFactory: async (ctxPayload: ContextPayload, manager: TypeOrmClientManager) => {
    if (ctxPayload.tenantId) {
      return await manager.getClient(ctxPayload.tenantId);
    }
  },
  inject: [REQUEST, TypeOrmClientManager]
};
