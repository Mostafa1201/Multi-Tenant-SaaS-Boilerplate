import { Injectable } from '@nestjs/common';
import { SaasService } from '../saas/saas.service';
import { TenantSettings } from '../../core/tenant/types/tenant-settings.interface';
import { TenantSettingsManagement } from '../../core/tenant/settings/tenant-settings-management';

export interface TenantSettingsData {
  env: TenantSettings;
}

@Injectable()
export class TenantSettingsManager {
  constructor(private readonly saasService: SaasService) {}
  async getClient(tenantId: string): Promise<TenantSettingsManagement> {
    return await this.saasService.reInitTenantSettings(tenantId);
  }
}
