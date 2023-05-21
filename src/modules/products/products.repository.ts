import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }
}
