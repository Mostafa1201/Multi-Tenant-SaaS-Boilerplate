import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TenantDetails } from '../types/tenant-settings.interface';

@Injectable()
export class TenantListData {
  private static _instance: TenantListData;
  private _list: Record<string, TenantDetails> = {};

  public static getInstance(): TenantListData {
    if (!this._instance) {
      TenantListData._instance = new TenantListData();
    }
    return TenantListData._instance;
  }

  setTenantDataSource(tenantCode: string, dataSource?: DataSource) {
    if (!this._list[tenantCode]) {
      this._list[tenantCode] = {} as TenantDetails;
    }
    this._list[tenantCode].dataSource = dataSource;
  }

  getTenantDataSource(tenantCode: string): DataSource | undefined {
    return this._list[tenantCode]?.dataSource;
  }

  removeTenant(tenantCode: string) {
    if (this._list[tenantCode]) {
      delete this._list[tenantCode];
    }
  }
}
