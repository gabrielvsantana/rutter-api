import { ShopifyLineItems, ShopifyOrders, ShopifyProducts } from '../shopify.types';

export const getShopifyLineItemMock = ({ id = 12345678, product_id = 87654321 }): ShopifyLineItems => {
  return { id, product_id } as ShopifyLineItems;
};

export const getShopifyOrderMock = ({ id = 123456, line_items = [getShopifyLineItemMock({}), getShopifyLineItemMock({})] }): ShopifyOrders => {
  return { id, line_items } as ShopifyOrders;
};

export const getShopifyProductMock = ({ id = 1234, title = 'shopify product name' }): ShopifyProducts => {
  return { id, title } as ShopifyProducts;
};
