import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NewCategoryDto } from 'src/dtos/categories_transactions/new.category.dto';

@Injectable()
export class CategoriesTransactionsService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('create-category');
    this.client.subscribeToResponseOf('edit-category');
    this.client.subscribeToResponseOf('list-category');
    this.client.subscribeToResponseOf('desactive-category');
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

  async editCategory(
    { name }: NewCategoryDto,
    user_id: number,
    categoryId: number,
  ) {
    if (!user_id) {
      throw new BadRequestException();
    }
    return await firstValueFrom(
      this.client.send('edit-category', {
        name,
        user_id,
        categoryId,
      }),
    );
  }

  async desactiveCategory(user_id: number, categoryId: number) {
    if (isNaN(categoryId) || isNaN(user_id) || !user_id) {
      throw new BadRequestException();
    }
    return await firstValueFrom(
      this.client.send('desactive-category', {
        user_id,
        categoryId,
      }),
    );
  }

  async listAllCategories(user_id: number) {
    return await firstValueFrom(this.client.send('list-category', user_id));
  }
}
