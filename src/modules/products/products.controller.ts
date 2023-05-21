import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { ProductResponse } from './dto/product-response.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({ type: ProductResponse, isArray: true })
  @ApiOperation({ summary: "Get all shopify's products" })
  async getProducts(): Promise<ProductResponse[]> {
    const products = await this.productsService.findAllProducts();
    return products.map((p) => new ProductResponse(p));
  }

  @Post()
  @ApiOperation({ summary: "Fetch shopify's products and persist" })
  async fetchAndPersist(): Promise<void> {
    await this.productsService.fetchAndPersist();
  }
}
