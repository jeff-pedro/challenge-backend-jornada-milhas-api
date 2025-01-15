import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  constructor() {}

  @Get()
  getHello(): object {
    return {
      message: 'Welcome to the Jornada Milhas API 🌍✈️!',
      documentation:
        'https://github.com/jeff-pedro/challenge-backend-jornada-milhas/wiki',
    };
  }
}
