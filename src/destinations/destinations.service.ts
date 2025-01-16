import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';
import { ConfigService } from '@nestjs/config';
import { CohereClient, CohereError, CohereTimeoutError } from 'cohere-ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Injectable()
export class DestinationsService {
  private destinations: Destination[] = [];

  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    private configService: ConfigService<
      {
        app: { accessKeys: { cohereApiKey: string } };
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
      informal e até 100 caracteres no máximo em cada parágrafo. 
      Crie 2 parágrafos neste resumo. O texto deve ser escrito em português do Brasil.`;

      createDestinationDto.descriptiveText =
        await this.generateText(textDescription);
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

  async generateText(prompt: string): Promise<string> {
    try {
      const token = this.configService.get('app.accessKeys.cohereApiKey', {
        infer: true,
      });

      const cohere = new CohereClient({ token });

      const chat = await cohere.chat({
        model: 'command',
        message: prompt,
      });

      return chat.text;
    } catch (error) {
      if (error instanceof CohereTimeoutError) {
        throw new RequestTimeoutException('Request timed out', {
          cause: error,
        });
      } else if (error instanceof CohereError) {
        throw new UnauthorizedException('Unauthorized api key', {
          cause: error,
        });
      }

      throw error;
    }
  }
}
