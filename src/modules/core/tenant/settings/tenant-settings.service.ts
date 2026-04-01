import { Injectable } from '@nestjs/common';
import { TenantSettingsManagement } from './tenant-settings-management';

@Injectable()
export class TenantSettingsService extends TenantSettingsManagement {}
