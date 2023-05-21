import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { OrdersRepository } from './orders.repository';
import { ShopifyService } from '../../services/shopify/shopify.service';
import { OrderEntity } from './order.entity';
import { LineItemEntity } from '../line-items/line-item.entity';
import { LineItemsRepository } from '../line-items/line-items.repository';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly lineItemsRepo: LineItemsRepository,
    private readonly productsService: ProductsService,
    private readonly shopifyService: ShopifyService,
  ) {}

  async fetchAndPersist(): Promise<void> {
    const products = await this.productsService.findAllProducts();

    if (!products.length) {
      throw new BadRequestException('Should have products before fetching orders');
    }

    const orders = await this.shopifyService.fetchOrders();

    const { orderEntities, lineItemEntities } = orders.reduce(
      (acc, order) => {
        const orderEntity = new OrderEntity();
        orderEntity.id = randomUUID();
        orderEntity.platformId = String(order.id);
        acc.orderEntities.push(orderEntity);

        const lineItemsEntities = order.line_items.map((lineItem) => {
          const product = products.find((p) => p.platformId === String(lineItem.product_id));
          const lineItemEntity = new LineItemEntity();
          lineItemEntity.orderId = orderEntity.id;
          lineItemEntity.platformId = String(lineItem.id);
          lineItemEntity.productId = product ? product.id : null;
          return lineItemEntity;
        });
        acc.lineItemEntities.push(...lineItemsEntities);

        return acc;
      },
      { orderEntities: [] as OrderEntity[], lineItemEntities: [] as LineItemEntity[] },
    );

    await this.ordersRepo.upsert(orderEntities, { conflictPaths: ['platformId'] });
    await this.lineItemsRepo.upsert(lineItemEntities, { conflictPaths: ['platformId'] });
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    return this.ordersRepo.find({ relations: { lineItems: true } });
  }
}
