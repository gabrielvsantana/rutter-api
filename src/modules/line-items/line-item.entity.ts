import { ManyToOne, PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';

import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';

@Entity({ name: 'line_items' })
export class LineItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity | null;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId?: string | null;

  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'platform_id', type: 'character varying', unique: true })
  platformId: string;
}
