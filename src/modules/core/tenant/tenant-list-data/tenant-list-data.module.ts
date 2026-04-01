import { Global, Module } from '@nestjs/common';
import { TenantListData } from './tenant-list-data.service';
import { TenantSettingsService } from '../settings/tenant-settings.service';
import { TenantSettingsInitializer } from '../settings/tenant-settings-initializer';

@Global()
@Module({
  providers: [
    {
      provide: TenantListData,
      useValue: TenantListData.getInstance()
    },
    {
      provide: TenantSettingsInitializer,
      useValue: TenantSettingsInitializer.getInstance()
    },
    TenantSettingsService
  ],
  exports: [TenantListData, TenantSettingsInitializer, TenantSettingsService]
})
export class TenantListDataModule {}
