import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';
import { DataSource } from 'typeorm';
import { TYPEORM_MASTER_PROVIDER } from '../../common/constants';
import { Encrypter } from '../../common/encryption/encryption.service';
import { TenantSettings } from './types/tenant-settings.interface';
import { Settings } from './settings/entities/settings.entity';

@Injectable()
export class TenantService {
  constructor(
    @Inject(TYPEORM_MASTER_PROVIDER)
    private readonly masterDataSource: DataSource,
    private readonly dataSource: DataSource,
    private readonly encrypter: Encrypter
  ) {}

  async getTenant(code: string) {
    return await this.masterDataSource.getRepository(Tenant).findOne({
      where: { tenantCode: code }
    });
  }

  async getTenantWithCredentials(code: string) {
    return await this.masterDataSource.getRepository(Tenant).findOne({
      where: { tenantCode: code },
      relations: ['dbCredentials']
    });
  }

  async getAllTenants() {
    return await this.masterDataSource.getRepository(Tenant).find();
  }

  async getAllTenantSettings() {
    const settings = await this.dataSource.getRepository(Settings).find();
    const keyValuePair: TenantSettings = {};

    for (const item of settings) {
      try {
        keyValuePair[item.key] = this.encrypter.decrypt(item.value);
      } catch (err) {}
    }
    return keyValuePair;
  }
}
