import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TenantDbCredentials } from '../tenant-credentials/entities/tenant-db-credentials.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenantName: string;

  @Column()
  tenantCode: string;

  @OneToOne(() => TenantDbCredentials, (dbCredentials) => dbCredentials.tenant)
  dbCredentials: TenantDbCredentials;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
