import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createUserContent, GoogleGenAI } from '@google/genai';
import { IAService } from "../interfaces/ai.service.interface";

@Injectable()
export class GeminiService implements IAService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateText(prompt: string, file?: unknown): Promise<string | null> {
    const apiKey = this.configService.get<string>('app.ai.apiKey');
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: this.configService.get<string>('app.ai.model')!,
        contents: createUserContent([
          prompt
        ]),
      });
      return response.text || "Text unavailable";
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}