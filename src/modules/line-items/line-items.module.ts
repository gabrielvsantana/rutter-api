import { Module } from '@nestjs/common';

import { LineItemsRepository } from './line-items.repository';

@Module({
  controllers: [],
  providers: [LineItemsRepository],
  imports: [],
  exports: [LineItemsRepository],
})
export class LineItemsModule {}
