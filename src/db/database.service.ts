import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TYPEORM_MASTER_PROVIDER } from '../modules/common/constants';
import { TenantDbCredentialService } from '../modules/core/tenant/tenant-credentials/tenant-db-credentials.service';
import { masterDataSourceOptions } from './datasource/master.datasource';
import { tenantDataSourceOptions } from './datasource/tenant.datasource';
import { DataSourceCredentials } from './types/datasource-credentials.interface';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(TYPEORM_MASTER_PROVIDER)
    private readonly masterDataSource: DataSource,
    private readonly tenantDbCredentialService: TenantDbCredentialService
  ) {}
  async createDatabaseSchema(databaseName: string): Promise<void> {
    await this.masterDataSource.query(`CREATE DATABASE ${databaseName}`);
  }

  createMasterDataSource() {
    return new DataSource(masterDataSourceOptions);
  }

  async createTenantDataSource(tenantCode: string) {
    const credentials = await this.tenantDbCredentialService.getDecryptedDbCredentials(tenantCode);
    const updatedDataSourceOptions = this.getUpdatedTenantDataSourceOptions(credentials);
    return await new DataSource(updatedDataSourceOptions).initialize();
  }

  async runSingleTenantMigration(credentials: DataSourceCredentials) {
    try {
      const updatedDataSourceOptions = this.getUpdatedTenantDataSourceOptions(credentials);
      const tenantDataSource = await new DataSource(updatedDataSourceOptions).initialize();
      const migration = await tenantDataSource.runMigrations();
      console.log('Migration ran successfully:', migration);
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }

  async initializeTenantDatabase(credentials: DataSourceCredentials) {
    await this.createDatabaseSchema(credentials.database);
    await this.runSingleTenantMigration(credentials);
  }

  getUpdatedTenantDataSourceOptions(credentials: DataSourceCredentials) {
    const updatedDataSourceOptions = {
      ...tenantDataSourceOptions,
      ...credentials
    };
    return updatedDataSourceOptions;
  }
}
