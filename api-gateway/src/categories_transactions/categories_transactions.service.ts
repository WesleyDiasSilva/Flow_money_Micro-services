import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NewCategoryDto } from 'src/dtos/categories_transactions/new.category.dto';

@Injectable()
export class CategoriesTransactionsService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get_transactions');
    this.client.subscribeToResponseOf('create-category');
    this.client.subscribeToResponseOf('validate_token');
    await this.client.connect();
  }

  async createCategory(newCategoryDto: NewCategoryDto, user_id: number) {
    if (!user_id) {
      throw new BadRequestException();
    }
    return await firstValueFrom(
      this.client.send('create-category', {
        name: newCategoryDto.name,
        user_id: user_id,
      }),
    );
  }
}
