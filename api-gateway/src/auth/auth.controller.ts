import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/auth/create.user.dto';
import { LoginUserDto } from 'src/dtos/auth/login.user.dto';
import { ValidationParam } from 'src/dtos/auth/validation.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create/default')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Get('validation/:code')
  async validationUser(@Param() { code }: ValidationParam) {
    return await this.authService.validationUser(code);
  }

  @Post('login/default')
  async loginUser(@Body() loginUser: LoginUserDto) {
    return await this.authService.loginUser(loginUser);
  }
}
