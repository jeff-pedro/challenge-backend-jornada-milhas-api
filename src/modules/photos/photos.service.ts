import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAService } from '../ai/interfaces/ai.service.interface';
import { AI_PROMPTS } from './constants/ai-prompts.constants';
import { ConfigService } from '@nestjs/config';
import { downloadImageFromUrl } from '../../helpers/downloadImageFromUrl';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @Inject('IAService')
    private readonly iaService: IAService,
    private readonly configService: ConfigService,
  ){}

  async findOne(id: number) {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) throw new NotFoundException('Photo not found');
    return photo;
  }

  async generateAndUpdatePhotoDescription(id: number) {
    // Find photo by ID or thown an exeception if not exist
    const photo = await this.findPhotoOrFail(id);

    // Get image content (URL or S3) using a helper method
    const imageContent = await this.getImageContent(photo.url);

    // Generate text description using IA service
    const generatedDescription = await this.iaService.generateText(
      AI_PROMPTS.PHOTO_DESCRIPTION,
      imageContent,
    ) ?? '';
    
    // Update photo description with generated text
    photo.description = generatedDescription;

    // Save updated photo to repository
    return this.photoRepository.save(photo);
  }

  private async getImageContent(url: string): Promise<string | Blob> {
    const isS3Enabled = this.configService.get<string>('AWS_S3_ENABLE') === 'true';
    if (isS3Enabled) {
      return downloadImageFromUrl(url);
    }
    return url;
  }

  private async findPhotoOrFail(id: number) {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }
}
