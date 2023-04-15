import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesTransactionsService } from './categories_transactions.service';

describe('CategoriesTransactionsService', () => {
  let service: CategoriesTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesTransactionsService],
    }).compile();

    service = module.get<CategoriesTransactionsService>(CategoriesTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
