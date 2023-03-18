import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create.user.dto';

@Controller()
export class AppController {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('auth_create');
    this.client.subscribeToResponseOf('auth_login');
    await this.client.connect();
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const result = await firstValueFrom(
      this.client.send('auth_create', createUserDto),
    );
    return result;
  }
}
