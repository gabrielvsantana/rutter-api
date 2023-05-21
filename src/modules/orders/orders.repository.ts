import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { OrderEntity } from './order.entity';

@Injectable()
export class OrdersRepository extends Repository<OrderEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }
}
