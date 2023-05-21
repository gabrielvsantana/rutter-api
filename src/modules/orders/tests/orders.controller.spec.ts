import { Test, TestingModule } from '@nestjs/testing';

import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { getOrderEntityMock, getOrderResponseMock } from './mocks';

describe('OrdersController', () => {
  let sut: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: { fetchAndPersist: jest.fn(), findAllOrders: jest.fn() } }],
    }).compile();

    sut = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('should get orders and map them correctly', async () => {
      const ordersEntities = [getOrderEntityMock({ id: '1' }), getOrderEntityMock({ id: '2' }), getOrderEntityMock({ id: '3' })];
      const ordersResponse = [getOrderResponseMock({ id: '1' }), getOrderResponseMock({ id: '2' }), getOrderResponseMock({ id: '3' })];
      jest.spyOn(ordersService, 'findAllOrders').mockResolvedValue(ordersEntities);
      expect(await sut.getOrders()).toEqual(ordersResponse);
      expect(ordersService.findAllOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchAndPersist', () => {
    it('should fetch and persist products by calling ordersService.fetchAndPersist', async () => {
      await sut.fetchAndPersist();
      expect(ordersService.fetchAndPersist).toHaveBeenCalledTimes(1);
    });
  });
});
