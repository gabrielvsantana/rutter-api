import { Test, TestingModule } from '@nestjs/testing';

import { ProductsService } from '../products.service';
import { ProductsRepository } from '../products.repository';
import { ShopifyService } from '../../../services/shopify/shopify.service';
import { getShopifyProductMock } from '../../../services/shopify/tests/mocks';
import { getProductEntityMock, getProductResponseMock } from './mocks';

describe('ProductsService', () => {
  let sut: ProductsService;
  let productsRepo: ProductsRepository;
  let shopifyService: ShopifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: { find: jest.fn(), upsert: jest.fn() },
        },
        {
          provide: ShopifyService,
          useValue: {
            fetchProducts: jest.fn().mockResolvedValue([getProductResponseMock({}), getProductResponseMock({}), getProductResponseMock({})]),
          },
        },
      ],
    }).compile();

    sut = module.get<ProductsService>(ProductsService);
    productsRepo = module.get<ProductsRepository>(ProductsRepository);
    shopifyService = module.get<ShopifyService>(ShopifyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndPersist', () => {
    it('should fetch products from shopify', async () => {
      await sut.fetchAndPersist();
      expect(shopifyService.fetchProducts).toHaveBeenCalledWith();
      expect(shopifyService.fetchProducts).toHaveBeenCalledTimes(1);
    });

    it('should create entities and upsert products in the database', async () => {
      const product = getShopifyProductMock({});
      const entity = getProductEntityMock({ name: product.title, platformId: String(product.id) });
      delete entity.id;
      jest.spyOn(shopifyService, 'fetchProducts').mockResolvedValue([product]);
      await sut.fetchAndPersist();
      expect(productsRepo.upsert).toHaveBeenCalledWith([expect.objectContaining({ ...entity })], { conflictPaths: ['platformId'] });
      expect(productsRepo.upsert).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllProducts', () => {
    it('should get all products', async () => {
      await sut.findAllProducts();
      expect(productsRepo.find).toHaveBeenCalledWith();
      expect(productsRepo.find).toHaveBeenCalledTimes(1);
    });
  });
});
