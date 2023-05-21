import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { LineItemEntity } from './line-item.entity';

@Injectable()
export class LineItemsRepository extends Repository<LineItemEntity> {
  constructor(private dataSource: DataSource) {
    super(LineItemEntity, dataSource.createEntityManager());
  }
}
