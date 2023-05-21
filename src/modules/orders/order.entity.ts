import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LineItemEntity } from '../line-items/line-item.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'platform_id', type: 'character varying', unique: true })
  platformId: string;

  @OneToMany(() => LineItemEntity, (lineItem) => lineItem.order, { cascade: true })
  lineItems: LineItemEntity[];
}
