import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { ProductsModule } from '../modules/products/products.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { AppModule } from '../app.module';

const options = new DocumentBuilder().setTitle('The Mini-Rutter API').setDescription('This is the Mini-Rutter API with Shopify').setVersion('1.0').build();

export const getSwaggerDocument = (app: NestExpressApplication) => {
  return SwaggerModule.createDocument(app, options, {
    include: [AppModule, ProductsModule, OrdersModule],
  });
};
