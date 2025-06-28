import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public-route.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class MainController {
  constructor() {}
  @Get()
  @Public()
  getHello(): object {
    return {
      message: 'Welcome to the Jornada Milhas API 🌍✈️!',
      documentation:
        'https://github.com/jeff-pedro/challenge-backend-jornada-milhas/wiki',
    };
  }
}
