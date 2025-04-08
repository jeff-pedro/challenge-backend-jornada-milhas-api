import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { IAService } from "../interfaces/ai.service.interface";

@Injectable()
export class GeminiService implements IAService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(private readonly configService: ConfigService) { }

  async generateText(prompt: string, file?: string | Blob): Promise<string | null> {
    const apiKey = this.configService.get<string>('app.ai.apiKey');

    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [prompt];

      if (file) {
        const image = await ai.files.upload({
          file,
          // config: { mimeType: 'image/jpeg' } // TODO: adicionar extensão aos arquivos
        });

        contents.push(
          createPartFromUri(image.uri as string, image.mimeType as string)
        );
      }

      const response = await ai.models.generateContent({
        model: this.configService.get<string>('app.ai.model')!,
        contents: createUserContent(contents),
      });

      return response.text || "Text unavailable";
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}