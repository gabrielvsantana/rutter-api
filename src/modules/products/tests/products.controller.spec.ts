import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { getProductEntityMock, getProductResponseMock } from './mocks';

describe('ProductsController', () => {
  let sut: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: { findAllProducts: jest.fn(), fetchAndPersist: jest.fn() },
        },
      ],
    }).compile();

    sut = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should get products and map them correctly', async () => {
      const productsEntities = [getProductEntityMock({ id: '1' }), getProductEntityMock({ id: '2' }), getProductEntityMock({ id: '3' })];
      const productsResponse = [getProductResponseMock({ id: '1' }), getProductResponseMock({ id: '2' }), getProductResponseMock({ id: '3' })];
      jest.spyOn(productsService, 'findAllProducts').mockResolvedValue(productsEntities);
      expect(await sut.getProducts()).toEqual(productsResponse);
      expect(productsService.findAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchAndPersist', () => {
    it('should fetch and persist products by calling productsService.fetchAndPersist', async () => {
      await sut.fetchAndPersist();
      expect(productsService.fetchAndPersist).toHaveBeenCalledTimes(1);
    });
  });
});
