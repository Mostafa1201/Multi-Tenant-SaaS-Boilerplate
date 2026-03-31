import dotenv from 'dotenv';
dotenv.config();
import { DataSource, DataSourceOptions } from 'typeorm';
import { masterEntities } from '../entities/masterEntities';

export const masterDataSourceOptions: DataSourceOptions | any = {
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
  entities: masterEntities,
  migrations: ['dist/db/master-migrations/**/*.js'],
  migrationsTableName: 'migration_table'
};

export default new DataSource(masterDataSourceOptions);
