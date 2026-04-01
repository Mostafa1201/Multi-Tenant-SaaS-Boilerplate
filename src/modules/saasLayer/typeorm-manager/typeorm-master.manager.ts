import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { masterDataSourceOptions } from '../../../db/datasource/master.datasource';
import { tenantEntities } from '../../../db/entities/tenantEntities';

@Injectable()
export class TypeOrmMasterManager implements OnModuleDestroy {
  private masterClient: DataSource | undefined;

  constructor() {
    masterDataSourceOptions.entities = [...masterDataSourceOptions.entities, ...tenantEntities];
    this.masterClient = new DataSource(masterDataSourceOptions);
  }

  async getClient(): Promise<DataSource> {
    return await this.masterClient.initialize();
  }

  async onModuleDestroy() {
    await this.masterClient.destroy();
  }
}
