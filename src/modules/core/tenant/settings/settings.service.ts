import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { Encrypter } from '../../../common/encryption/encryption.service';
import { LOGGER_MASTER_PROVIDER } from '../../../common/constants';
import { LoggerService } from '../../../../logger/logger.service';
import { TenantSettings } from '../types/tenant-settings.interface';
import { UpdateTenantSettingsDto } from '../../../saasLayer/saas/dtos/update-tenant-settings.dto';
@Injectable()
export class SettingsService {
  constructor(
    private readonly encrypter: Encrypter,
    @Inject(LOGGER_MASTER_PROVIDER)
    private readonly loggerService: LoggerService
  ) {}

  async getDecryptedSettings(dataSource: DataSource): Promise<TenantSettings> {
    if (dataSource) {
      const settings = await dataSource.getRepository(Settings).find();
      const keyValuePair: TenantSettings = {};

      for (const item of settings) {
        try {
          keyValuePair[item.key] = this.encrypter.decrypt(item.value);
        } catch (err) {
          this.loggerService.error(`Something went wrong while decrypting ${item.value}`, err?.message);
        }
      }
      return keyValuePair;
    }
    throw new Error('Error fetching tenant settings');
  }

  async initializeTenantSettings(dataSource: DataSource, envKeyValuePair: UpdateTenantSettingsDto) {
    const encryptedValue = this.encrypter.encrypt(envKeyValuePair.value);
    const setting = await dataSource.getRepository(Settings).findOne({
      where: {
        key: envKeyValuePair.key
      }
    });
    if (setting) {
      return await dataSource.getRepository(Settings).update({ id: setting.id }, { value: encryptedValue });
    } else {
      const encryptedKeyValuePair = await dataSource.getRepository(Settings).create({
        key: envKeyValuePair.key,
        value: encryptedValue
      });
      return await dataSource.getRepository(Settings).save(encryptedKeyValuePair);
    }
  }

  async initializeTenantSettingsMany(dataSource: DataSource, envKeyValuePairList: UpdateTenantSettingsDto[]) {
    const settingsData = [];
    for (const element of envKeyValuePairList) {
      const initiatedPair = await this.initializeTenantSettings(dataSource, element);
      settingsData.push(initiatedPair);
    }
    return settingsData;
  }
}
