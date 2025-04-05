import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDestinationDto } from '../dto/update-destination.dto';
import { Destination } from '../entities/destination.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinationDto } from '../dto/create-destination.dto';
import { Photo } from '../../photos/entities/photo.entity';
import { IAService } from '../interfaces/ai.service.interface';
import { AI_PROMPTS } from '../constants/ai-prompts.constants';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @Inject('IAService')
    private readonly iaService: IAService,
  ) {}
  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    if (!createDestinationDto.descriptiveText) {
      const prompt = AI_PROMPTS.DESTINATION_DESCRIPTION(createDestinationDto.name);
      createDestinationDto.descriptiveText = await this.iaService.generateText(prompt) ?? '';
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
    const destinationSaved = await this.destinationRepository
    .createQueryBuilder('destination')
    .leftJoinAndSelect('destination.photos', 'photo')
    .where('destination.id = :id', { id })
    .select(['destination', 'photo.url'])
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
      photoEntity.url = (file as any).location ?? file.path;
      photoEntity.description = 'Photo description'; // TODO: auto-generate via AI
      destination.photos.push(photoEntity);
    }
    
    await this.destinationRepository.save(destination);
    return destination.photos;
  }
}
