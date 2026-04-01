import { Global, Module } from '@nestjs/common';
import { SaasController } from './saas.controller';
import { SaasService } from './saas.service';
import { TypeOrmClientProvider } from '../providers/typeorm-client.provider';
import { TypeOrmMasterProvider } from '../providers/typeorm-master.provider';
import { TypeOrmMasterManager } from '../typeorm-manager/typeorm-master.manager';
import { TypeOrmClientManager } from '../typeorm-manager/typeorm-client.manager';
import { LoggerClientProvider } from '../providers/logger-client.provider';
import { LoggerClientManager } from '../logger-manager/logger-client.manager';
import { LoggerMasterProvider } from '../providers/logger-master.provider';
import { LoggerMasterManager } from '../logger-manager/logger-master.manager';
import { TenantSettingsProvider } from '../providers/tenant-settings.provider';
import { TenantSettingsManager } from '../tenant-settings-manager/tenant-settings.manager';
import { TenantService } from '../../core/tenant/tenant.service';
import { TenantSettingsInitializer } from '../../core/tenant/settings/tenant-settings-initializer';

@Global()
@Module({
  imports: [],
  controllers: [SaasController],
  providers: [
    SaasService,
    TenantService,
    TypeOrmClientProvider,
    TypeOrmMasterProvider,
    TypeOrmMasterManager,
    TypeOrmClientManager,
    LoggerClientProvider,
    LoggerMasterProvider,
    LoggerClientManager,
    LoggerMasterManager,
    TenantSettingsProvider,
    TenantSettingsManager,
    TenantSettingsInitializer
  ],
  exports: [
    SaasService,
    TypeOrmClientProvider,
    TypeOrmMasterProvider,
    TypeOrmMasterManager,
    TypeOrmClientManager,
    LoggerMasterProvider,
    LoggerClientProvider,
    LoggerClientManager,
    LoggerMasterManager,
    TenantSettingsProvider,
    TenantSettingsManager
  ]
})
export class SaasModule {}
