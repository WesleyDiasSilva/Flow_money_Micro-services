import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { NewCategoryDto } from 'src/dtos/categories_transactions/new.category.dto';
import { AuthRequest } from 'src/types/auth.request';
import { CategoryIdParam } from 'src/types/id.param';
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

  @Put('/:id')
  async editCategoryTransaction(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Body() newCateryDto: NewCategoryDto,
    @Param() { id }: CategoryIdParam,
  ) {
    try {
      const categoryId = Number(id);
      const user_id = req.user_id;
      const result = await this.categoriesTransactionsService.editCategory(
        newCateryDto,
        user_id,
        categoryId,
      );
      console.log('Resultado da requisição: ', result);
      if (result === 'ConflictException: Conflict') {
        return res.status(409).send('Category already exists!');
      }
      if (result === 'UnauthorizedException: Unauthorized') {
        return res.status(401).send('Unauthorized!');
      }
      if (result === 'BadRequestException: Bad Request') {
        return res.status(400).send('Bad Request!');
      }
      return res.status(201).send({
        category: result,
        message:
          'Your category has been successfully edited, it will be available in a few moments!',
      });
    } catch {
      return 'Sorry, we were unable to edit your category at the moment, please try again later!';
    }
  }

  @Patch('/:id')
  async desactiveCategoryTransaction(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param() { id }: CategoryIdParam,
  ) {
    try {
      const categoryId = Number(id);
      const user_id = req.user_id;
      const result = await this.categoriesTransactionsService.desactiveCategory(
        user_id,
        categoryId,
      );
      if (result === 'ConflictException: Conflict') {
        return res.status(409).send('Category already exists!');
      }
      if (result === 'ForbiddenException: Forbidden') {
        return res
          .status(422)
          .send(
            'You cannot have a transaction linked to this category before deactivating it!',
          );
      }
      if (result === 'UnauthorizedException: Unauthorized') {
        return res.status(401).send('Unauthorized!');
      }
      if (result === 'BadRequestException: Bad Request') {
        return res.status(400).send('Bad Request!');
      }
      return res.status(201).send({
        category: result,
        message: 'Your category has been successfully desactived!',
      });
    } catch {
      return 'Sorry, we were unable to desactive your category at the moment, please try again later!';
    }
  }

  @Get()
  async listAllCategories(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const user_id = req.user_id;
      const result = await this.categoriesTransactionsService.listAllCategories(
        user_id,
      );
      if (result === 'UnauthorizedException: Unauthorized') {
        return res.status(401).send('Unauthorized!');
      }
      return res.status(200).send(result);
    } catch {}
  }
}
