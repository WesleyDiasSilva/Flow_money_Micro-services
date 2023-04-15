import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesTransactionsController } from './categories_transactions.controller';

describe('CategoriesTransactionsController', () => {
  let controller: CategoriesTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesTransactionsController],
    }).compile();

    controller = module.get<CategoriesTransactionsController>(CategoriesTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
