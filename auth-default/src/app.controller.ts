import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create.user.dto';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly appService: AppService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @MessagePattern('auth_create_default')
  async createUser(@Payload() message: CreateUserDto) {
    try {
      const newUser = await this.appService.createUser(message);
      return `You will receive a confirmation email shortly at: ${newUser.email}, remember to check the spam box.`;
    } catch {
      return 'Invalid email or unable to register on our platform at the moment, please try again later!';
    }
  }

  @MessagePattern('auth_validation_default')
  async validationUser(@Payload() message: boolean) {
    try {
    } catch {}
  }

  // @MessagePattern('auth_login_default')
  // async loginUser(@Payload() message: KafkaMessage) {
  //   console.log('Message: ', message);
  //   return 'Created user default';
  // }
}
