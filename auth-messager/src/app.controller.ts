import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create.user.dto';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly appService: AppService,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('auth_create_default');
    this.client.subscribeToResponseOf('auth_create_google');
    await this.client.connect();
  }

  @MessagePattern('auth_create')
  async sendMessegerCreateUser(@Payload() message: CreateUserDto) {
    console.log(message);
    const response = await this.appService.forwardMessage(message);
    this.logger.log(response);
    return response;
  }
}
