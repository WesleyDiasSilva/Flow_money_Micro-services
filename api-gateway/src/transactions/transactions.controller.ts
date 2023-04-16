import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { NewTransactionDto } from 'src/dtos/transactions/new.transaction.dto';
import { AuthRequest } from 'src/types/auth.request';
import { CategoryIdParam } from 'src/types/id.param';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('create')
  async createTransaction(
    @Body() transaction: Omit<NewTransactionDto, 'user_id'>,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    try {
      await this.transactionService.create({
        user_id: req.user_id,
        ...transaction,
      });
      return res
        .status(201)
        .send(
          'Your transaction has been successfully registered, it will be available in a few moments!',
        );
    } catch {
      return res
        .status(400)
        .send(
          'Sorry, we were unable to add a new transaction at the moment, please try again later!',
        );
    }
  }

  @Put('/:id')
  async editTransaction(
    @Body() transaction: Omit<NewTransactionDto, 'user_id'>,
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param() { id }: CategoryIdParam,
  ) {
    try {
      const user_id = req.user_id;
      await this.transactionService.editTransaction(transaction, user_id, id);
      return res
        .status(200)
        .send('Your transaction will be edited in the soon!');
    } catch {
      return res
        .status(500)
        .send(
          'Sorry, we were unable to edit your transaction at the moment, please try again later!',
        );
    }
  }

  @Delete('/:id')
  async deleteTransaction(
    @Param() { id }: CategoryIdParam,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    try {
      const user_id = req.user_id;
      await this.transactionService.deleteTransaction(user_id, id);
      return res
        .status(200)
        .send('Your transaction will be excluded in the soon!');
    } catch {
      return res
        .status(500)
        .send(
          'Sorry, we were unable to delete this transaction at the moment, please try again later!',
        );
    }
  }

  @Get('/:id')
  async getTransactionById(
    @Param() { id }: CategoryIdParam,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    try {
      const user_id = req.user_id;
      const transaction = await this.transactionService.getTransactionById({
        user_id,
        id: Number(id),
      });
      console.log('TRANSAÇÃO POR ID: ', transaction);
      return res.status(200).send(transaction);
    } catch {
      return res.sendStatus(500);
    }
  }

  @Get('')
  async getTransactions(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const user_id = req.user_id;
      const transactions = await this.transactionService.getTransactions(
        user_id,
      );
      return res.status(200).send(transactions);
    } catch {
      return res.sendStatus(500);
    }
  }
}
