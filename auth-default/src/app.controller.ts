import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUserDto } from './dtos/login.user.dto';

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
    } catch (err) {
      console.log(err);
      return 'Try again later!';
    }
  }

  @MessagePattern('auth_validation_default')
  async validationUser(@Payload() message: string) {
    try {
      const token = await this.appService.validationNewUser(message);
      return token;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  @MessagePattern('auth_login_default')
  async loginUser(@Payload() message: LoginUserDto) {
    try {
      return await this.appService.loginUser(message);
    } catch (err) {
      console.log(err);
      return {
        error: 'Unable to log in at the moment, please try again later!',
      };
    }
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() token: string) {
    try {
      return this.appService.validateToken(token);
    } catch {
      return 'Token invalid!';
    }
  }
}
