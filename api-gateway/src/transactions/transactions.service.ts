import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NewTransactionDto } from 'src/dtos/transactions/new.transaction.dto';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get_transactions');
    await this.client.connect();
  }

  async create(transaction: NewTransactionDto) {
    this.client.emit('create_transaction', transaction);
  }
}
