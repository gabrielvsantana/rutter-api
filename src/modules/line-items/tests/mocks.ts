import { LineItemEntity } from '../line-item.entity';
import { LineItemsResponse } from '../dto/line-items-response.dto';
import { getOrderEntityMock } from '../../../modules/orders/tests/mocks';
import { getProductEntityMock } from '../../../modules/products/tests/mocks';

export const getLineItemEntityMock = ({
  id = 'string',
  product = getProductEntityMock({ id: 'product-id' }),
  productId = 'product-id',
  order = getOrderEntityMock({ id: 'order-id' }),
  orderId = 'order-id',
  platformId = 'platform-id',
}): LineItemEntity => {
  return { id, product, productId, order, orderId, platformId } as LineItemEntity;
};

export const getLineItemResponseMock = ({ product_id = 'product-id' }): LineItemsResponse => {
  return { product_id } as LineItemsResponse;
};
