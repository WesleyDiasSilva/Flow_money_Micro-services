import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-microservice',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-microservice-group',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository, PrismaService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('Auth Default Microservice is running!');
  }
}
