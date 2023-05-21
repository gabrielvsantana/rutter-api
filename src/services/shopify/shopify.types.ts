export enum ShopifyResources {
  Products = 'products',
  Orders = 'orders',
}

export enum PaginationType {
  Next = 'next',
  Previous = 'previous',
}

export type ShopifyHeaders = {
  'Content-Type': string;
  'X-Shopify-Access-Token': string;
};

export type ShopifyPagination = {
  url: string | null;
  type: PaginationType | null;
};

export type ShopifyLineItems = {
  id: number;
  product_id: number;
};

export type ShopifyOrders = {
  id: number;
  line_items: ShopifyLineItems[];
};

export type ShopifyProducts = {
  id: number;
  title: string;
};
