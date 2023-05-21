import { Module } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ServiceModule } from '../../services/service.module';
import { LineItemsModule } from '../line-items/line-items.module';
import { OrdersRepository } from './orders.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  imports: [ServiceModule, LineItemsModule, ProductsModule],
  exports: [],
})
export class OrdersModule {}
