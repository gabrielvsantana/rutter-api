import { ApiProperty } from '@nestjs/swagger';

import { OrderEntity } from '../order.entity';
import { LineItemsResponse } from '../../line-items/dto/line-items-response.dto';

export class OrderResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  platform_id: string;

  @ApiProperty()
  line_items: LineItemsResponse[];

  constructor(data: OrderEntity) {
    this.id = data.id;
    this.platform_id = data.platformId;
    this.line_items = data.lineItems.map((item) => new LineItemsResponse(item));
  }
}
