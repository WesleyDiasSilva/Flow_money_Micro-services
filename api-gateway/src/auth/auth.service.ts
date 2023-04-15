import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/dtos/auth/create.user.dto';
import { LoginUserDto } from 'src/dtos/auth/login.user.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('auth_create_default');
    this.client.subscribeToResponseOf('auth_validation_default');
    this.client.subscribeToResponseOf('auth_login_default');
  }

  async createUser(createUserDto: CreateUserDto) {
    const result = await firstValueFrom(
      this.client.send('auth_create_default', createUserDto),
    );
    return result;
  }

  async validationUser(code: string) {
    const result = await firstValueFrom(
      this.client.send('auth_validation_default', code),
    );
    return result;
  }

  async loginUser(loginUser: LoginUserDto) {
    try {
      const result = await firstValueFrom(
        this.client.send('auth_login_default', loginUser),
      );
      return result;
    } catch (error) {
      console.log(error);
      return {
        err: 'Our services are currently unavailable, please try again later!',
      };
    }
  }
}
