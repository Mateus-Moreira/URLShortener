import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  shortUrl!: string;

  @Column()
  originalUrl!: string;

  @Column({ nullable: true })
  userId?: number;

  @Column({ default: 0 })
  accessCount!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
