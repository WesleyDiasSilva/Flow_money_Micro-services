import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { NewCategoryDto } from 'src/dtos/categories_transactions/new.category.dto';
import { AuthRequest } from 'src/types/auth.request';
import { CategoriesTransactionsService } from './categories_transactions.service';

@Controller('categories-transactions')
export class CategoriesTransactionsController {
  constructor(
    private readonly categoriesTransactionsService: CategoriesTransactionsService,
  ) {}

  @Post()
  async createCategoryTransaction(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Body() newCateryDto: NewCategoryDto,
  ) {
    try {
      const user_id = req.user_id;
      const result = await this.categoriesTransactionsService.createCategory(
        newCateryDto,
        user_id,
      );
      if (result === 'ConflictException: Conflict') {
        return res.status(401).send('Category already exists!');
      }
      return res.status(201).send({
        category: result,
        message:
          'Your category has been successfully registered, it will be available in a few moments!',
      });
    } catch {
      return 'Sorry, we were unable to add a new category at the moment, please try again later!';
    }
  }
}
