import { Controller, Get } from '@nestjs/common';
import { Public } from './resources/decorators/public-route.decorator';

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
