import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
