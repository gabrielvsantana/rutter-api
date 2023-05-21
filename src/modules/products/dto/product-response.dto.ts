import { ApiProperty } from '@nestjs/swagger';

import { ProductEntity } from '../product.entity';

export class ProductResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  platform_id: string;

  constructor(data: ProductEntity) {
    this.id = data.id;
    this.name = data.name;
    this.platform_id = data.platformId;
  }
}
