import { Module } from '@nestjs/common';
import { GeminiService } from './services/gemini.service';

@Module({
  providers: [
    {
      provide: 'IAService',
      useClass: GeminiService
    }
  ],
  exports: ['IAService']
})
export class AIModule {}
