import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantDbCredentials } from './entities/tenant-db-credentials.entity';
import { CreateTenantDbCredentialsDto } from './dtos/create-tenant-credentials.dto';
import { UpdateTenantCredentialsDto } from './dtos/update-tenant-credentials.dto';
import { TYPEORM_MASTER_PROVIDER } from '../../../common/constants';
import { DataSourceCredentials } from '../../../../db/types/datasource-credentials.interface';
import { Tenant } from '../entities/tenant.entity';
import { Encrypter } from '../../../common/encryption/encryption.service';

@Injectable()
export class TenantDbCredentialService {
  constructor(
    @Inject(TYPEORM_MASTER_PROVIDER)
    private readonly masterDataSource: DataSource,
    private readonly encrypter: Encrypter
  ) {}

  async createTenantDbCredentials(tenantId: number, createTenantDbCredentialsDto: CreateTenantDbCredentialsDto) {
    const encryptedCredentials = this.encryptDbCredentials(createTenantDbCredentialsDto);
    const credentials = await this.masterDataSource.getRepository(TenantDbCredentials).create({
      tenantId,
      ...encryptedCredentials
    });
    return await this.masterDataSource.getRepository(TenantDbCredentials).save(credentials);
  }

  async updateTenantDbCredentials(tenantId: number, updateTenantCredentialsDto: UpdateTenantCredentialsDto) {
    const encryptedCredentials = this.encryptDbCredentials(updateTenantCredentialsDto);
    const { host, port, database, username, password } = encryptedCredentials;

    return await this.masterDataSource
      .getRepository(TenantDbCredentials)
      .update(tenantId, { host, port, database, username, password });
  }

  async getTenantDbCredentials(tenantCode: string) {
    const tenant = await this.masterDataSource.getRepository(Tenant).findOne({
      where: { tenantCode },
      relations: ['dbCredentials'],
      select: {
        dbCredentials: {
          host: true,
          port: true,
          database: true,
          username: true,
          password: true
        }
      }
    });
    return {
      host: tenant?.dbCredentials.host,
      port: tenant?.dbCredentials.port,
      database: tenant?.dbCredentials.database,
      username: tenant?.dbCredentials.username,
      password: tenant?.dbCredentials.password
    };
  }

  encryptDbCredentials(createTenantDbCredentialsDto: DataSourceCredentials) {
    // Shallow copy credentials so it doesn't affect the createTenantDbCredentialsDto object reference
    const dataSourceCredentials: DataSourceCredentials = { ...createTenantDbCredentialsDto };
    for (const key in dataSourceCredentials) {
      const value = dataSourceCredentials[key];
      dataSourceCredentials[key] = this.encrypter.encrypt(value);
    }
    return dataSourceCredentials;
  }

  async getDecryptedDbCredentials(tenantCode: string): Promise<DataSourceCredentials> {
    const decryptedCredentials: DataSourceCredentials = {};
    const tenantDbCredentials = await this.getTenantDbCredentials(tenantCode);
    for (const key in tenantDbCredentials) {
      const credential = tenantDbCredentials[key];
      decryptedCredentials[key] = this.encrypter.decrypt(credential);
    }
    return decryptedCredentials;
  }
}
