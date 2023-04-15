import { Logger, Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
            clientId: 'auth-default-microservice',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-default-microservice-group',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppRepository,
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('Auth Default Microservice is running!');
  }
}
