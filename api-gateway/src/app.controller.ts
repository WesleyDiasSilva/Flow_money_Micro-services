import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUserDto } from './dtos/login.user.dto';
import { ValidationParam } from './dtos/validation.dto';

@Controller('auth')
export class AppController {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('auth_create');
    this.client.subscribeToResponseOf('auth_login');
    this.client.subscribeToResponseOf('auth_validation');
    await this.client.connect();
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await firstValueFrom(
      this.client.send('auth_create', createUserDto),
    );
    return result;
  }

  @Get('validation/:code')
  async validationUser(@Param() { code }: ValidationParam) {
    console.log(code);
    const result = await firstValueFrom(
      this.client.send('auth_validation', code),
    );
    return result;
  }

  @Post('login')
  async loginUser(@Body() loginUser: LoginUserDto) {
    try {
      const result = await firstValueFrom(
        this.client.send('auth_login', loginUser),
      );
      return result;
    } catch {
      return {
        err: 'Our services are currently unavailable, please try again later!',
      };
    }
  }
}
