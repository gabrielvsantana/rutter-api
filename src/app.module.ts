import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataBaseModule } from './config/database.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LineItemsModule } from './modules/line-items/line-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [ConfigModule.forRoot(), DataBaseModule, ProductsModule, OrdersModule, LineItemsModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
