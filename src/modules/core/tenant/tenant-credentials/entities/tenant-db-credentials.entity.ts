import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';

@Entity()
export class TenantDbCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenantId: number;

  @Column()
  host: string;

  @Column()
  port: string;

  @Column()
  database: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Tenant, (tenant) => tenant.dbCredentials)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
