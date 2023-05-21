import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RawAxiosResponseHeaders, AxiosResponse, AxiosError } from 'axios';
import { Observable } from 'rxjs';

import { ShopifyService } from '../shopify.service';
import { getShopifyOrderMock, getShopifyProductMock } from './mocks';
import { PaginationType } from '../shopify.types';
import { env } from '../../../config/env';

const getReqHeaders = ({ token = 'access-token' }) => {
  return {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': token,
  };
};

const getResHeadersLink = ({ randomUri = 'BvT8JCcDCwHW5fPC53dvD7', paginationType = PaginationType.Previous }) => {
  return {
    link: `<https://cool-shop.myshopify.com/admin/api/2022-04/products.json?limit=50&page_info=${randomUri}>; rel="${paginationType}"`,
  } as RawAxiosResponseHeaders;
};

const generateProducts = (numOrders: number) => {
  return Array.from({ length: numOrders }, () => getShopifyProductMock({}));
};

const generateOrders = (numOrders: number) => {
  return Array.from({ length: numOrders }, () => getShopifyOrderMock({}));
};

describe('ShopifyService', () => {
  let sut: ShopifyService;
  let httpService: HttpService;
  const mockEnv = {
    SHOPIFY_STORE_URL: 'https://store.myshopify.com',
    SHOPIFY_ACCESS_TOKEN: 'abc123',
  };

  beforeEach(() => {
    jest.mock('../../../config/env');
    (env as any) = mockEnv;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopifyService, { provide: HttpService, useValue: { get: jest.fn() } }],
    }).compile();

    sut = module.get<ShopifyService>(ShopifyService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('fetchProducts', () => {
    it('should fetch products correctly', async () => {
      const headers = getResHeadersLink({});
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(
          new Observable((observer) => {
            observer.next({
              data: { products: [...generateProducts(50)] },
              headers: getResHeadersLink({ paginationType: PaginationType.Next }),
            } as AxiosResponse);
            observer.complete();
          }),
        )
        .mockReturnValueOnce(
          new Observable((observer) => {
            observer.next({ data: { products: [...generateProducts(13)] }, headers } as AxiosResponse);
            observer.complete();
          }),
        );
      expect(await sut.fetchProducts()).toHaveLength(63);
    });

    it('should throw HttpException if error', async () => {
      const status = 500;
      const data = 'anything-data';
      const url = `${env.SHOPIFY_STORE_URL}/admin/api/2022-04/products.json`;
      const headers = getReqHeaders({ token: env.SHOPIFY_ACCESS_TOKEN });
      const spy = jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        return new Observable((subscriber) => subscriber.error({ response: { data, status } } as AxiosError));
      });
      await expect(sut.fetchProducts()).rejects.toThrow(new HttpException(data, status));
      expect(spy).toHaveBeenCalledWith(url, { headers });
    });

    it('should handle undefined link correctly', async () => {
      const headers = { link: undefined } as RawAxiosResponseHeaders;
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        new Observable((observer) => {
          observer.next({ data: { products: [...generateProducts(13)] }, headers } as AxiosResponse);
          observer.complete();
        }),
      );
      expect(await sut.fetchProducts()).toBeTruthy();
    });

    it('should handle empty linkContents correctly', async () => {
      const headers = { link: 'Something other than a URL' } as RawAxiosResponseHeaders;
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        new Observable((observer) => {
          observer.next({ data: { products: [...generateProducts(13)] }, headers } as AxiosResponse);
          observer.complete();
        }),
      );
      expect(await sut.fetchProducts()).toBeTruthy();
    });
  });

  describe('fetchOrders', () => {
    it('should fetch orders correctly up to 500 orders', async () => {
      const getNewOrderObservable = () => {
        return new Observable((observer) => {
          observer.next({ data: { orders: [...generateOrders(50)] }, headers: getResHeadersLink({ paginationType: PaginationType.Next }) } as AxiosResponse);
          observer.complete();
        }) as Observable<AxiosResponse<unknown, any>>;
      };
      const headers = getResHeadersLink({});

      /**
       * Eleven chained observables, of which:
       * 10 * 50 = 500
       * 1 * 13 = 13
       * Total = 513
       */
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(getNewOrderObservable())
        .mockReturnValueOnce(
          new Observable((observer) => {
            observer.next({ data: { orders: [...generateOrders(13)] }, headers } as AxiosResponse);
            observer.complete();
          }),
        );
      expect(await sut.fetchOrders()).toHaveLength(500);
    });
  });
});
