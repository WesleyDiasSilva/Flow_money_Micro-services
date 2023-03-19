import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dtos/create.user.dto';
import { PrismaService } from './prisma.service';

export class AppRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaClient) {}

  async findUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async validateEmailUser(id: number) {
    await this.prisma.user.update({
      data: {
        validated_email: true,
      },
      where: {
        id,
      },
    });
  }

  async createUser(user: CreateUserDto) {
    const { email, name, password } = user;
    return this.prisma.user.create({
      data: {
        login_default: true,
        email,
        name,
        password,
        validated_email: false,
      },
    });
  }

  async createVerification(user_id: number, code: string) {
    return await this.prisma.verification.upsert({
      where: {
        user_id,
      },
      update: {
        verificated: false,
        code,
      },
      create: {
        code,
        user_id,
        verificated: false,
      },
    });
  }

  async findValidation(code: string) {
    return await this.prisma.verification.findFirst({
      where: {
        code,
      },
    });
  }

  async validate(user_id: number) {
    await this.prisma.verification.update({
      where: {
        user_id,
      },
      data: {
        verificated: true,
      },
    });
  }

  async createSession(token: string, user_id: number) {
    await this.prisma.session.upsert({
      create: {
        token,
        user_id,
      },
      update: {
        token,
      },
      where: {
        user_id,
      },
    });
  }
}
