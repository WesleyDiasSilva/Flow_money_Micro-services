import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUserDto } from './dtos/login.user.dto';

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
    this.client.subscribeToResponseOf('auth_validation_default');
    this.client.subscribeToResponseOf('auth_login_default');
    await this.client.connect();
  }

  @MessagePattern('auth_create')
  async sendMessegerCreateUser(@Payload() message: CreateUserDto) {
    const response = await this.appService.forwardMessage(message);
    this.logger.log(response);
    return response;
  }

  @MessagePattern('auth_validation')
  async validationNewUser(@Payload() message: string) {
    const response = await this.appService.forwardValidation(message);
    this.logger.log(response);
    return response;
  }

  @MessagePattern('auth_login')
  async validationLogin(@Payload() message: LoginUserDto) {
    try {
      return await this.appService.forwardLogin(message);
    } catch {
      return {
        err: 'Our services are currently undergoing maintenance, please try again later!',
      };
    }
  }
}
