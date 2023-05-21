import { Injectable } from '@nestjs/common';
import { InsertResult } from 'typeorm';

import { ShopifyService } from '../../services/shopify/shopify.service';
import { ProductsRepository } from './products.repository';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly shopifyService: ShopifyService, private readonly productsRepo: ProductsRepository) {}

  async fetchAndPersist(): Promise<InsertResult> {
    const products = await this.shopifyService.fetchProducts();
    const entities = products.map((product) => {
      const entity = new ProductEntity();
      entity.name = product.title;
      entity.platformId = String(product.id);
      return entity;
    });
    return this.productsRepo.upsert(entities, { conflictPaths: ['platformId'] });
  }

  async findAllProducts(): Promise<ProductEntity[]> {
    return this.productsRepo.find();
  }
}
