import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { NewNotification } from './dtos/new.notification.dto';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}
  @MessagePattern('notify')
  async handleNotification(@Payload() message: NewNotification) {
    this.logger.log(message);
    return await this.appService.verifyTypes(message);
  }
}
