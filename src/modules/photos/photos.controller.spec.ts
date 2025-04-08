import { Test } from '@nestjs/testing';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('PhotosController', () => {
  let controller: PhotosController;
  let service: PhotosService;

  const mockPhotoService = {
    findOne: jest.fn(),
    update: jest.fn(),
    generateAndUpdatePhotoDescription: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PhotosController],
    })
      .useMocker((token) => {
        if (token === PhotosService) {
          return mockPhotoService;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<PhotosController>(PhotosController);
    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return one photo', async () => {
      const mockPhoto = { id: 1, url: 'test.jpg', description: 'test' };
      mockPhotoService.findOne.mockResolvedValue(mockPhoto);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPhoto);
      expect(mockPhotoService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('autoUpdateDescription', () => {
    it('should update the property description automaticaly', async () => {
      const mockPhoto = { id: 1, url: 'test.jpg', description: 'test updated' };
      mockPhotoService.generateAndUpdatePhotoDescription.mockResolvedValue(mockPhoto);

      const result = await controller.autoUpdateDescription(1);

      expect(result).toEqual(mockPhoto);
      expect(mockPhotoService.generateAndUpdatePhotoDescription).toHaveBeenCalledWith(1);
    })
  })
});