import { Injectable } from '@nestjs/common';
import { TenantSettingsManagement } from './tenant-settings-management';
import { TenantSettingsService } from './tenant-settings.service';

@Injectable()
export class TenantSettingsInitializer {
  private static _instance: TenantSettingsInitializer;
  private _list: Record<string, TenantSettingsManagement> = {};

  public static getInstance(): TenantSettingsInitializer {
    if (!this._instance) {
      TenantSettingsInitializer._instance = new TenantSettingsInitializer();
    }
    return TenantSettingsInitializer._instance;
  }

  private setSettings(tenantCode: string, tenantSettingsManagement?: TenantSettingsManagement) {
    this._list[tenantCode] = tenantSettingsManagement;
  }

  getSettings(tenantCode: string): TenantSettingsManagement {
    if (!this._list[tenantCode]) {
      this.setSettings(tenantCode, new TenantSettingsService());
    }
    return this._list[tenantCode];
  }
}
