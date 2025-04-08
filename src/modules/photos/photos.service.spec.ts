import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as downloadHelper from '../../helpers/downloadImageFromUrl';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { IAService } from '../destinations/interfaces/ai.service.interface';

const moduleMocker = new ModuleMocker(global);
jest.mock('../../helpers/downloadImageFromUrl');

describe('PhotosService', () => {
  let service: PhotosService;
  let repository: Repository<Photo>;
  let configService: ConfigService;
  let iaService: IAService;

  const PHOTO_REPOSITORY_TOKEN = getRepositoryToken(Photo);

  const mockPhoto = {
    id: 1,
    url: 'test.jpg',
    description: 'test'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotosService],
    })
      .useMocker((token) => {
        if (token === 'PhotoRepository') {
          return {
            findOneBy: jest.fn().mockResolvedValue(mockPhoto),
          }
        }
        if (token === 'ConfigService') {
          return {
            get: jest.fn(),
          }
        }
        if (token === 'IAService') {
          return {
            generateText: jest.fn(),
          }
        }
        if (typeof token === 'function') {
          const moduleMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(moduleMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<PhotosService>(PhotosService);
    repository = module.get<Repository<Photo>>(PHOTO_REPOSITORY_TOKEN);
    configService = module.get<ConfigService>(ConfigService);
    iaService = module.get('IAService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a photo object', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockPhoto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('generateAndUpdatePhotoDescription', () => {
    it('should download image when s3 is enabled', async () => {
      const url = 'https://mybucket.s3.amazonaws.com/image.jpg';
      const mockBlob = new Blob(['binary image'], { type: 'image/jpeg' });

      jest.spyOn(configService, 'get').mockReturnValue('true');
      jest.spyOn(downloadHelper, 'downloadImageFromUrl').mockResolvedValue(mockBlob);

      const result = await service['getImageContent'](url);

      expect(result).toBe(mockBlob);
      expect(downloadHelper.downloadImageFromUrl).toHaveBeenCalledWith(url);
    });

    it('should return the url when s3 is disabled', async () => {
      const url = 'https://mybucket.s3.amazonaws.com/image.jpg';

      jest.spyOn(configService, 'get').mockReturnValue('false');

      const result = await service['getImageContent'](url);

      expect(result).toBe(url);
    });

    it('should throw error when downloading image from s3', async () => {
      const url = 'https://mybucket.s3.amazonaws.com/image.jpg';

      jest.spyOn(configService, 'get').mockReturnValue('true');
      jest.spyOn(downloadHelper, 'downloadImageFromUrl').mockRejectedValue(new Error('Failed to download image'));

      await expect(service['getImageContent'](url)).rejects.toThrow('Failed to download image');
    });

    it('should generate description using AI service', async () => {
      const url = 'https://mybucket.s3.amazonaws.com/image.jpg';
      const mockDescription = 'AI generated description';

      jest.spyOn(configService, 'get').mockReturnValue('true');
      jest.spyOn(iaService, 'generateText').mockResolvedValue(mockDescription);

      const result = await service['iaService'].generateText('prompt', url);

      expect(result).toBe(mockDescription);
      expect(iaService.generateText).toHaveBeenCalledWith('prompt', url);
    });
  });
});
