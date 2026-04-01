import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateTenantSettingsDto } from './dtos/update-tenant-settings.dto';
import * as fs from 'fs';
import * as path from 'path';
import { REQUEST } from '@nestjs/core';
import { TenantService } from '../../core/tenant/tenant.service';
import { DatabaseService } from '../../../db/database.service';
import { getTenantConstants, TENANTS_DATA_PATH, TYPEORM_MASTER_PROVIDER } from '../../common/constants';
import { TenantDbCredentialService } from '../../core/tenant/tenant-credentials/tenant-db-credentials.service';
import { SettingsService } from '../../core/tenant/settings/settings.service';
import { TenantSettingsInitializer } from '../../core/tenant/settings/tenant-settings-initializer';
import { TenantListData } from '../../core/tenant/tenant-list-data/tenant-list-data.service';
import { CreateTenantDto } from '../../core/tenant/dtos/create-tenant.dto';
import { Tenant } from '../../core/tenant/entities/tenant.entity';
import { UpdateTenantDataDto } from '../../core/tenant/dtos/update-tenant.dto';
import { TenantDbCredentials } from '../../core/tenant/tenant-credentials/entities/tenant-db-credentials.entity';
import { TenantSettings } from '../../core/tenant/types/tenant-settings.interface';
import { GeneralErrors } from '../../common/localization/general-errors.en';

@Injectable()
export class SaasService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly databaseService: DatabaseService,
    @Inject(TYPEORM_MASTER_PROVIDER)
    private readonly masterDataSource: DataSource,
    private readonly tenantDbCredentialService: TenantDbCredentialService,
    private readonly settingsService: SettingsService,
    @Inject(REQUEST)
    private readonly request,
    private readonly tenantSettingsInitializer: TenantSettingsInitializer,
    private readonly tenantListData: TenantListData
  ) {}

  async createPilot(createTenantDto: CreateTenantDto) {
    const { tenantCode, tenantName } = createTenantDto;
    const tenant = await this.tenantService.getTenant(tenantCode);
    if (tenant) {
      throw new BadRequestException(GeneralErrors.TENANT_ALREADY_EXISTS);
    }
    const newTenant = await this.masterDataSource.getRepository(Tenant).create({
      tenantCode,
      tenantName
    });
    await this.masterDataSource.getRepository(Tenant).save(newTenant);
    await this.tenantDbCredentialService.createTenantDbCredentials(newTenant.id, createTenantDto.dbCredentials);
    await this.databaseService.initializeTenantDatabase(createTenantDto.dbCredentials);
  }

  async updatePilot(data: UpdateTenantDataDto) {
    const tenantCode = this.request.tenantId;
    const existingTenant = await this.masterDataSource.getRepository(Tenant).findOne({ where: { tenantCode } });
    if (existingTenant) {
      await this.masterDataSource.getRepository(Tenant).update(existingTenant.id, {
        tenantName: data.tenantName,
        tenantCode: data.tenantCode
      });
      await this.tenantDbCredentialService.updateTenantDbCredentials(existingTenant.id, data.dbCredentials);
    }
  }

  async deletePilot(tenantCode: string) {
    const tenant = await this.tenantService.getTenantWithCredentials(tenantCode);
    if (!tenant) {
      throw new BadRequestException(GeneralErrors.TENANT_NOT_FOUND);
    }
    if (tenant.dbCredentials) {
      await this.masterDataSource.getRepository(TenantDbCredentials).delete({
        tenantId: tenant.id
      });
    }
    await this.masterDataSource.getRepository(Tenant).delete({
      id: tenant.id
    });
  }

  async createEnvironment(tenantCode: string, envKeyValuePairList: UpdateTenantSettingsDto[]) {
    const dataSource = await this.databaseService.createTenantDataSource(tenantCode);
    this.tenantListData.setTenantDataSource(tenantCode, dataSource);
    const settingsUpdateResult = await this.settingsService.initializeTenantSettingsMany(
      dataSource,
      envKeyValuePairList
    );
    await this.reInitTenantSettings(tenantCode);
    return settingsUpdateResult;
  }

  async getTenantDbCredentials() {
    const tenantCode = this.request.tenantId;
    const existingTenant = await this.masterDataSource.getRepository(Tenant).findOne({ where: { tenantCode } });
    if (existingTenant) {
      return await this.tenantDbCredentialService.getDecryptedDbCredentials(tenantCode);
    }
  }

  async uploadTenantLogo(logo: Express.Multer.File): Promise<any> {
    const tenantCode = this.request.tenantId;
    const uploadFolder = `${TENANTS_DATA_PATH}/${tenantCode}/logo`;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    const fileName = `logo.png`;
    const filePath = path.join(uploadFolder, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    fs.writeFileSync(filePath, logo.buffer as any);
    return `image uploaded successfully for ${tenantCode} `;
  }

  async uploadTemplateLogo(template: Express.Multer.File): Promise<any> {
    const tenantCode = this.request.tenantId;
    const uploadFolder = `${TENANTS_DATA_PATH}/${tenantCode}/logo`;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    const fileName = `template.png`;
    const filePath = path.join(uploadFolder, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    fs.writeFileSync(filePath, template.buffer as any);
    return `template logo uploaded successfully for ${tenantCode} `;
  }

  async reInitTenantSettings(tenantCode: string) {
    const tenantDbCredentials = await this.tenantDbCredentialService.getDecryptedDbCredentials(tenantCode);
    const tenantDataSource = this.tenantListData.getTenantDataSource(tenantCode);
    const tenantSettings = await this.settingsService.getDecryptedSettings(tenantDataSource);
    let keyValuePair: TenantSettings = {};
    keyValuePair = { ...tenantSettings, ...tenantDbCredentials, tenantId: tenantCode };
    const settings = this.tenantSettingsInitializer.getSettings(tenantCode);
    settings.setTenantEnv(keyValuePair);
    settings.setTenantConstants(getTenantConstants(keyValuePair));
    return settings;
  }
}
