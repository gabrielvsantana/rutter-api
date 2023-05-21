import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { OrdersService } from '../orders.service';
import { LineItemsRepository } from '../../../modules/line-items/line-items.repository';
import { ProductsService } from '../../../modules/products/products.service';
import { ShopifyService } from '../../../services/shopify/shopify.service';
import { OrdersRepository } from '../orders.repository';
import { getShopifyLineItemMock, getShopifyOrderMock } from '../../../services/shopify/tests/mocks';
import { getProductEntityMock } from '../../../modules/products/tests/mocks';
import { getLineItemEntityMock } from '../../../modules/line-items/tests/mocks';
import { getOrderEntityMock } from './mocks';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('OrdersService', () => {
  let sut: OrdersService;
  let ordersRepo: OrdersRepository;
  let lineItemsRepo: LineItemsRepository;
  let productsService: ProductsService;
  let shopifyService: ShopifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: { find: jest.fn(), upsert: jest.fn() } },
        { provide: LineItemsRepository, useValue: { upsert: jest.fn() } },
        {
          provide: ProductsService,
          useValue: {
            findAllProducts: jest
              .fn()
              .mockResolvedValue([
                getProductEntityMock({ platformId: '1337' }),
                getProductEntityMock({ platformId: '13372' }),
                getProductEntityMock({ platformId: '13373' }),
              ]),
          },
        },
        {
          provide: ShopifyService,
          useValue: { fetchOrders: jest.fn().mockResolvedValue([getShopifyOrderMock({}), getShopifyOrderMock({}), getShopifyOrderMock({})]) },
        },
      ],
    }).compile();

    sut = module.get<OrdersService>(OrdersService);
    ordersRepo = module.get<OrdersRepository>(OrdersRepository);
    lineItemsRepo = module.get<LineItemsRepository>(LineItemsRepository);
    productsService = module.get<ProductsService>(ProductsService);
    shopifyService = module.get<ShopifyService>(ShopifyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndPersist', () => {
    it('should get all products from database', async () => {
      await sut.fetchAndPersist();
      expect(productsService.findAllProducts).toHaveBeenCalledWith();
      expect(productsService.findAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no products', async () => {
      jest.spyOn(productsService, 'findAllProducts').mockResolvedValue([]);
      await expect(sut.fetchAndPersist()).rejects.toThrow(BadRequestException);
      expect(productsService.findAllProducts).toHaveBeenCalledWith();
      expect(productsService.findAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should fetch orders from shopify', async () => {
      await sut.fetchAndPersist();
      expect(shopifyService.fetchOrders).toHaveBeenCalledWith();
      expect(shopifyService.fetchOrders).toHaveBeenCalledTimes(1);
    });

    it('should create orders entities and upsert correctly in the database', async () => {
      const order = getShopifyOrderMock({});
      const entity = getOrderEntityMock({ id: 'mocked-uuid', platformId: String(order.id) });
      delete entity.lineItems;
      jest.spyOn(shopifyService, 'fetchOrders').mockResolvedValue([order]);
      await sut.fetchAndPersist();
      expect(ordersRepo.upsert).toHaveBeenCalledWith([expect.objectContaining({ ...entity })], { conflictPaths: ['platformId'] });
      expect(ordersRepo.upsert).toHaveBeenCalledTimes(1);
    });

    it('should create line items entities and upsert correctly in the database', async () => {
      const order = getShopifyOrderMock({ line_items: [getShopifyLineItemMock({ product_id: 789 })] });
      const product = getProductEntityMock({ platformId: '789' });
      const lineItemEntity = getLineItemEntityMock({ orderId: 'mocked-uuid', platformId: String(order.line_items[0].id), productId: product.id });
      delete lineItemEntity.id;
      delete lineItemEntity.order;
      delete lineItemEntity.product;
      jest.spyOn(shopifyService, 'fetchOrders').mockResolvedValue([order]);
      jest.spyOn(productsService, 'findAllProducts').mockResolvedValue([product]);
      await sut.fetchAndPersist();
      expect(lineItemsRepo.upsert).toHaveBeenCalledTimes(1);
      expect(lineItemsRepo.upsert).toHaveBeenCalledWith([lineItemEntity], { conflictPaths: ['platformId'] });
    });
  });

  describe('findAllOrders', () => {
    it('should get all orders with line items', async () => {
      await sut.findAllOrders();
      expect(ordersRepo.find).toHaveBeenCalledWith({ relations: { lineItems: true } });
      expect(ordersRepo.find).toHaveBeenCalledTimes(1);
    });
  });
});
