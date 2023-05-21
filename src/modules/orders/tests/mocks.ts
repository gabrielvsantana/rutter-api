import { OrderResponse } from '../dto/order-response.dto';
import { OrderEntity } from '../order.entity';

export const getOrderEntityMock = ({ id = 'product-id', platformId = 'platform-id', lineItems = [] }): OrderEntity => {
  return { id, platformId, lineItems } as OrderEntity;
};

export const getOrderResponseMock = ({ id = 'product-id', platform_id = 'platform-id', line_items = [] }): OrderResponse => {
  return { id, platform_id, line_items } as OrderResponse;
};
