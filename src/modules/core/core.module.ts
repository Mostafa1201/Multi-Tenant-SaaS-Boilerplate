import { Global, Module } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { TenantDbCredentialService } from './tenant/tenant-credentials/tenant-db-credentials.service';
import { SettingsService } from './tenant/settings/settings.service';

@Global()
@Module({
  providers: [DatabaseService, TenantDbCredentialService, SettingsService],
  exports: [DatabaseService, TenantDbCredentialService, SettingsService]
})
export class CoreModule {}
