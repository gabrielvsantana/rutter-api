import { ProductResponse } from '../dto/product-response.dto';
import { ProductEntity } from '../product.entity';

export const getProductEntityMock = ({ id = 'product-id', name = 'product-name', platformId = 'platform-id' }): ProductEntity => {
  return { id, name, platformId } as ProductEntity;
};

export const getProductResponseMock = ({ id = 'product-id', name = 'product-name', platform_id = 'platform-id' }): ProductResponse => {
  return { id, name, platform_id } as ProductResponse;
};
