import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';

import { PaginationType, ShopifyHeaders, ShopifyOrders, ShopifyPagination, ShopifyProducts, ShopifyResources } from './shopify.types';
import { env } from '../../config/env';

@Injectable()
export class ShopifyService {
  constructor(private httpService: HttpService) {}

  private getHeaders(): ShopifyHeaders {
    return {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': env.SHOPIFY_ACCESS_TOKEN,
    };
  }

  private extractPaginationInfo(link: string | undefined): ShopifyPagination | null {
    if (!link) {
      return null;
    }

    const linkContents = link.match(/<(.*)>; rel=\"(.*)\"/);
    return linkContents ? { url: linkContents[1], type: linkContents[2] as PaginationType } : null;
  }

  private getDataChunk(url: string) {
    return lastValueFrom(
      this.httpService.get(url, { headers: this.getHeaders() }).pipe(
        catchError(({ response }: AxiosError) => {
          throw new HttpException(response.data, response.status);
        }),
      ),
    );
  }

  private async getDataSet<T>(url: string, resource: ShopifyResources, maxRecords?: number): Promise<T[]> {
    const items: T[] = [];

    while (url) {
      const response = await this.getDataChunk(url);
      const data = response.data[resource];
      items.push(...data);

      const linkHeader = response.headers.link;
      const paginationInfo = this.extractPaginationInfo(linkHeader);
      url = paginationInfo?.type === PaginationType.Next ? paginationInfo?.url : null;

      if (maxRecords && items.length >= maxRecords) {
        break;
      }
    }

    return items;
  }

  async fetchProducts(): Promise<ShopifyProducts[]> {
    const url = `${env.SHOPIFY_STORE_URL}/admin/api/2022-04/products.json`;
    return this.getDataSet<ShopifyProducts>(url, ShopifyResources.Products);
  }

  async fetchOrders(): Promise<ShopifyOrders[]> {
    const MAX_RECORDS = 500;
    const url = `${env.SHOPIFY_STORE_URL}/admin/api/2022-04/orders.json`;
    return this.getDataSet<ShopifyOrders>(url, ShopifyResources.Orders, MAX_RECORDS);
  }
}
