import { FactoryProvider, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmMasterManager } from '../typeorm-manager/typeorm-master.manager';
import { TYPEORM_MASTER_PROVIDER } from '../../common/constants';

export interface ContextPayload {
  tenantId: string;
}

export const TypeOrmMasterProvider: FactoryProvider<DataSource> = {
  provide: TYPEORM_MASTER_PROVIDER,
  scope: Scope.DEFAULT,
  useFactory: async (manager: TypeOrmMasterManager) => {
    return await manager.getClient();
  },
  inject: [TypeOrmMasterManager]
};
