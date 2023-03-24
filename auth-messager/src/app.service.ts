import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUserDto } from './dtos/login.user.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async forwardMessage(message: CreateUserDto) {
    const { email, name, password, method } = message;
    const newUserMessage = { email, name, password };

    if (method === 'default') {
      const response = await firstValueFrom(
        this.client.send('auth_create_default', newUserMessage),
      );
      return response;
    } else if (method === 'google') {
      const response = await firstValueFrom(
        this.client.send('auth_create_google', newUserMessage),
      );
      return response;
    } else {
      return 'Method invalid!';
    }
  }

  async forwardValidation(message: string) {
    return await firstValueFrom(
      this.client.send('auth_validation_default', message),
    );
  }

  async forwardLogin(message: LoginUserDto) {
    return await firstValueFrom(
      this.client.send('auth_login_default', message),
    );
  }
}
