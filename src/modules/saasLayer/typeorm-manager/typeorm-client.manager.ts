import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantListData } from '../../core/tenant/tenant-list-data/tenant-list-data.service';
@Injectable()
export class TypeOrmClientManager {
  constructor(private readonly tenantListData: TenantListData) {}
  async getClient(tenantId: string): Promise<DataSource> {
    return this.tenantListData.getTenantDataSource(tenantId);
  }
}
