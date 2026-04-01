import { DataSource } from 'typeorm';

export interface TenantSettings {
  [key: string]: string;
}

export type TenantDetails = {
  dataSource: DataSource;
  otherProperties?: any;
};
