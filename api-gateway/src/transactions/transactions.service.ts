import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NewTransactionDto } from 'src/dtos/transactions/new.transaction.dto';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get_transactions');
    this.client.subscribeToResponseOf('get_transaction_by_id');
    await this.client.connect();
  }

  async create(transaction: NewTransactionDto) {
    this.client.emit('create_transaction', { payload: transaction });
    return;
  }

  async editTransaction(
    transaction: Omit<NewTransactionDto, 'user_id'>,
    user_id: number,
    transactionId: string,
  ) {
    const transactionForEdit = {
      ...transaction,
      user_id,
      transactionId: Number(transactionId),
    };
    this.client.emit('edit_transaction', {
      payload: transactionForEdit,
    });
  }

  async deleteTransaction(user_id: number, transactionId: string) {
    this.client.emit('delete_transaction', {
      payload: { user_id, id: Number(transactionId) },
    });
  }

  async getTransactionById(message: { user_id: number; id: number }) {
    const transaction = await firstValueFrom(
      this.client.send('get_transaction_by_id', message),
    );
    return transaction;
  }

  async getTransactions(user_id: number) {
    const transactions = await firstValueFrom(
      this.client.send('get_transactions', user_id),
    );
    return transactions;
  }
}
