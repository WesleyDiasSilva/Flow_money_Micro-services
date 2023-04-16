import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { NextFunction, Response } from 'express';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthService } from './auth/auth.service';
import { CategoriesTransactionsController } from './categories_transactions/categories_transactions.controller';
import { CategoriesTransactionsService } from './categories_transactions/categories_transactions.service';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';
import { AuthRequest } from './types/auth.request';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'api-gateway-group',
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    TransactionsController,
    AuthController,
    CategoriesTransactionsController,
  ],
  providers: [
    AuthService,
    TransactionsService,
    CategoriesTransactionsService,
    AuthMiddleware,
  ],
})
export class AppModule {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: AuthRequest, res: Response, next: NextFunction) =>
        new AuthMiddleware(this.client).use(req, res, next),
      )
      .forRoutes('categories-transactions', 'transactions');
  }
}
