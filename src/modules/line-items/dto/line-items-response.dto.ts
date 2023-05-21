import { ApiProperty } from '@nestjs/swagger';

import { LineItemEntity } from '../line-item.entity';

export class LineItemsResponse {
  @ApiProperty()
  product_id: string | null;

  constructor(data: LineItemEntity) {
    this.product_id = data.productId;
  }
}
