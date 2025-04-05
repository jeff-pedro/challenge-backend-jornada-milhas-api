import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAService } from "./ai.service.interface";

@Injectable()
export class GeminiService implements IAService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly model: any;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('ia.apiKey')!;
    const genAI = new GoogleGenerativeAI(token);
    this.model = genAI.getGenerativeModel({ model: this.configService.get<string>('app.ia.model')! });
  }

  async generateText(prompt: string): Promise<string | null> {
    try {
      const chat = await this.model.generateContent(prompt);
      return chat.response.text() || "Text unavailable";
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}