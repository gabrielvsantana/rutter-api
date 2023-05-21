export const env = {
  PG_URI: process.env.PG_URI || 'postgres://rutteruser:rutterpass@localhost:5432/postgres',
  SHOPIFY_STORE_URL: process.env.SHOPIFY_STORE_URL || 'shopify-store-url',
  SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN || 'shopify-access-token',
  PORT: process.env.PORT || 8080,
};
