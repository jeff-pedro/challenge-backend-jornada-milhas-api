import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { GoogleGenerativeAI, GoogleGenerativeAIError } from '@google/generative-ai';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    private configService: ConfigService<
      {
        app: { accessKeys: { geminiApiKey: string } };
      },
      true
    >,
  ) {}
  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    if (!createDestinationDto.descriptiveText) {
      const textDescription = `Faça um resumo sobre ${createDestinationDto.name} enfatizando o 
      porque este lugar é incrível. Utilize uma linguagem 
      informal de até 100 caracteres no máximo em cada parágrafo. 
      Crie 2 parágrafos neste resumo. O texto deve ser escrito em português do Brasil.`;

      createDestinationDto.descriptiveText =
        await this.generateDescriptionWithGemini(textDescription);
    }

    return this.destinationRepository.save(createDestinationDto);
  }

  async findAll(name?: string): Promise<Destination[]> {
    const destinationSaved = await this.destinationRepository.find({
      where: { name },
      relations: ['photos'],
      select: { photos: { url: true } },
    });

    if (destinationSaved.length === 0) {
      throw new NotFoundException('Any destination was found');
    }

    return destinationSaved;
  }

  async findOne(id: string): Promise<Destination> {
    const destinationSaved = await this.destinationRepository.findOne({
      where: { id },
      relations: ['photos'],
      select: {
        photos: {
          url: true,
        },
      },
    });

    if (!destinationSaved) {
      throw new NotFoundException('Destination not found');
    }

    return destinationSaved;
  }

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<void> {
    const destinationToUpdate = await this.destinationRepository.update(
      { id },
      updateDestinationDto,
    );

    if (destinationToUpdate.affected === 0) {
      throw new NotFoundException('Destination not found');
    }
  }

  async remove(id: string): Promise<void> {
    const destinationToDelete = await this.destinationRepository.delete(id);

    if (destinationToDelete.affected === 0) {
      throw new NotFoundException('Destination not found');
    }
  }

  async generateDescriptionWithGemini(prompt: string): Promise<string> {
    try {
      const token = this.configService.get('app.accessKeys.geminiApiKey', {
        infer: true,
      });
      const genAI = new GoogleGenerativeAI(token);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = await model.generateContent(prompt);

      return chat.response.text() || "Description unavailable";
    } catch (error) {
      
      console.error("Error getting Gemini description", error.message, error);

      if (error instanceof GoogleGenerativeAIError) {
        throw new UnauthorizedException('Unauthorized api key', {
          cause: error,
        });
      }

      console.error("Error getting Gemini description", error.message, error);
      throw new Error("Error getting Gemini description");
    }
  }
}
