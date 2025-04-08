import { Test } from '@nestjs/testing';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { Photo } from '../photos/entities/photo.entity';
import { Destination } from './entities/destination.entity';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('DestinationsController', () => {
  let destinationsController: DestinationsController;
  let destinationsService: DestinationsService;

  const destinationMock = {
    id: '1',
    photos: [new Photo()],
    name: 'Test',
    target: 'Test target',
    descriptiveText: 'Text description',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DestinationsController],
    })
    .useMocker((token) => {
      if (token === DestinationsService) {
        return {
          findAll: jest.fn().mockResolvedValue([destinationMock]),
          create: jest.fn().mockResolvedValue(destinationMock),
          findOne: jest.fn().mockResolvedValue(destinationMock),
          update: jest.fn(),
          remove: jest.fn(),
          attachPhotos: jest.fn().mockResolvedValue([{}]),
        }
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(
          token,
        ) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
        
      }
    })
    .compile();

    destinationsController = moduleRef.get(DestinationsController);
    destinationsService = moduleRef.get(DestinationsService);
  });

  it('should be defined', () => {
    expect(destinationsController).toBeDefined();
  });

  it('destinationService should be defined', () => {
    expect(destinationsService).toBeDefined();
  });

  describe('create', () => {
    it('should return an object of destination', async () => {
      const destinationDto = {
        name: 'Test',
        target: 'Test target',
        descriptiveText: 'Text description',
      };
      const result = destinationMock;
      expect(await destinationsController.create(destinationDto)).toEqual(result);
    });
  });
  
  describe('uploadPhotos', () => {
    it('should return a successful message', async () => {
      const files: Express.Multer.File[] = [];

      expect(await destinationsController.uploadPhotos('1', files)).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return an object of destination', async () => {
      const results: Destination[] = [destinationMock];
      expect(await destinationsController.findAll()).toStrictEqual(results);
    });
  });

  describe('findOne', () => {
    it('should return an array of destinations', async () => {
      const result = destinationMock;
      expect(await destinationsController.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should return a sucesseful message', async () => {
      const result = {
        message: `Destination #${destinationMock.id} was updated`,
      };

      expect(await destinationsController.update('1', { name: 'Netherlands' })).toEqual(
        result,
      );
    });
  });

  describe('delete', () => {
    it('should return a sucesseful message', async () => {
      const result = {
        message: `Destination #${destinationMock.id} was deleted`,
      };

      expect(await destinationsController.remove('1')).toEqual(result);
    });
  });
});
