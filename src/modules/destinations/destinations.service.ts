import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { Photo } from '../photos/entities/photo.entity';
import { IAService } from '../ai/interfaces/ai.service.interface';
import { AI_PROMPTS } from './constants/ai-prompts.constants';
import { PaginationQueryParamsDto } from '../../common/dtos/pagination-query-params.dto';
import { PaginatedDto } from 'src/common/dtos/paginated.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @Inject('IAService')
    private readonly iaService: IAService,
  ) { };

  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    if (!createDestinationDto.description) {
      const promptText = AI_PROMPTS.DESTINATION_DESCRIPTION_TEXT(createDestinationDto.name);
      const text = await this.iaService.generateText(promptText) ?? '';

      const promptTitle = AI_PROMPTS.DESTINATION_DESCRIPTION_TITLE(text);
      const promptSubtitle = AI_PROMPTS.DESTINATION_DESCRIPTION_SUBTITLE(text);

      const title = await this.iaService.generateText(promptTitle) ?? '';
      const subtitle = await this.iaService.generateText(promptSubtitle) ?? '';

      createDestinationDto.description = {
        text,
        title,
        subtitle
      };
    }

    return this.destinationRepository.save(createDestinationDto);
  }

  async findAll(params: PaginationQueryParamsDto): Promise<PaginatedDto<Destination>> {
    const { page, limit, search: name } = params;

    const offset = (page - 1) * limit;

    const [destinations, total] = await this.destinationRepository.findAndCount({
      where: { name },
      relations: ['photos'],
      select: { photos: { url: true } },
      skip: (page - 1) * limit,
      take: offset,
    });

    if (destinations.length === 0) {
      throw new NotFoundException('Any destination was found');
    }

    return {
      total,
      limit,
      offset,
      results: destinations,
    }
  }

  async findOne(id: string): Promise<Destination> {
    const destinationSaved = await this.destinationRepository
      .createQueryBuilder('destination')
      .leftJoin('destination.description', 'description')
      .leftJoin('destination.photos', 'photos')
      .select(['destination', 'photos'])
      .addSelect([
        'description.text',
        'description.title',
        'description.subtitle'
      ])
      .where('destination.id = :id', { id })
      .getOne();

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

  async attachPhotos(id: string, files: Express.Multer.File[]): Promise<Photo[]> {
    const destination = await this.findOne(id);

    for (const file of files) {
      const photoEntity = new Photo();
      const photoUri = (file as any).location ?? file.path;

      photoEntity.url = photoUri;

      destination.photos.push(photoEntity);
    }

    await this.destinationRepository.save(destination);
    return destination.photos;
  }
}
