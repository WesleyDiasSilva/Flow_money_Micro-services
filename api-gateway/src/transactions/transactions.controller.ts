import { Body, Controller, Post } from '@nestjs/common';
import { NewTransactionDto } from 'src/dtos/transactions/new.transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('create')
  async createTransaction(@Body() transaction: NewTransactionDto) {
    try {
      await this.transactionService.create(transaction);
      return 'Your transaction has been successfully registered, it will be available in a few moments!';
    } catch {
      return 'Sorry, we were unable to add a new transaction at the moment, please try again later!';
    }
  }

  // @Post('category')
  // async createCategory(@Body() newCategory: NewCategoryDto) {
  // }
}
