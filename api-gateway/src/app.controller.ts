import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  test() {
    return {
      status: 'Online',
      message: 'API-GATEWAY IS RUNNING',
    };
  }
}
