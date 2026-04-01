import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  level: string;

  @Column()
  trace: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;
}
