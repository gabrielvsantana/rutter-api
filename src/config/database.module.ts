import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LineItemEntity } from '../modules/line-items/line-item.entity';
import { OrderEntity } from '../modules/orders/order.entity';
import { ProductEntity } from '../modules/products/product.entity';
import { env } from './env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        url: env.PG_URI,
        autoLoadEntities: true,
        entities: [ProductEntity, OrderEntity, LineItemEntity],
        synchronize: false,
      }),
    }),
  ],
})
export class DataBaseModule {}
