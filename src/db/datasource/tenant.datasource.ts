import dotenv from 'dotenv';
dotenv.config();
import { DataSource, DataSourceOptions } from 'typeorm';
import { tenantEntities } from '../entities/tenantEntities';

export const tenantDataSourceOptions: DataSourceOptions | any = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectTimeout: 30000,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: tenantEntities,
  migrations: ['dist/db/migrations/**/*.js'],
  migrationsTableName: 'migration_table'
};

export default new DataSource(tenantDataSourceOptions);
