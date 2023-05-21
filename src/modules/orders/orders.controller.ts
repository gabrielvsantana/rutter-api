import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { OrderResponse } from './dto/order-response.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOkResponse({ type: OrderResponse, isArray: true })
  @ApiOperation({ summary: "Get all shopify's orders" })
  async getOrders(): Promise<OrderResponse[]> {
    const orders = await this.ordersService.findAllOrders();
    return orders.map((p) => new OrderResponse(p));
  }

  @Post()
  @ApiOperation({ summary: "Fetch shopify's orders with line items and persist" })
  async fetchAndPersist(): Promise<void> {
    await this.ordersService.fetchAndPersist();
  }
}
