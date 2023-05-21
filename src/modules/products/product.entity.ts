import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying' })
  name: string;

  @Column({ name: 'platform_id', type: 'character varying', unique: true })
  platformId: string;
}
