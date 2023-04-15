// auth.middleware.ts
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NextFunction, Response } from 'express';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AuthRequest } from 'src/types/auth.request';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token notttttt provided' });
    }

    try {
      const tokenInfo = await firstValueFrom(
        this.client.send('validate_token', token),
      );
      if (!tokenInfo.user_id) {
        return res.status(401).json({ message: 'Token invalid' });
      }
      req.user_id = tokenInfo.user_id;
      next();
    } catch (error) {
      if (error instanceof TimeoutError) {
        return res.status(504).json({ message: 'Exceeded waiting time' });
      }
      return res.status(401).json({ message: 'Token invalid' });
    }
  }
}
