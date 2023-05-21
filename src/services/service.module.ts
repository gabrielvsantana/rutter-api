import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { ShopifyService } from './shopify/shopify.service';

@Module({
  controllers: [],
  providers: [ShopifyService],
  imports: [HttpModule, ConfigModule],
  exports: [ShopifyService],
})
export class ServiceModule {}
