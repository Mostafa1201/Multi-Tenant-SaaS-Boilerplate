import { FactoryProvider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TenantSettingsManager } from '../tenant-settings-manager/tenant-settings.manager';
import { TenantSettingsManagement } from '../../core/tenant/settings/tenant-settings-management';
import { TenantSettingsService } from '../../core/tenant/settings/tenant-settings.service';

export interface ContextPayload {
  tenantId: string;
}

export const TenantSettingsProvider: FactoryProvider<TenantSettingsManagement> = {
  provide: TenantSettingsService,
  scope: Scope.REQUEST,
  durable: true,
  useFactory: async (ctxPayload: ContextPayload, manager: TenantSettingsManager) => {
    if (ctxPayload.tenantId) {
      return await manager.getClient(ctxPayload.tenantId);
    }
  },
  inject: [REQUEST, TenantSettingsManager]
};
