import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notifier-microservice',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'notifier-microservice-group',
      },
    },
  });
  app.listen();
}
bootstrap();
