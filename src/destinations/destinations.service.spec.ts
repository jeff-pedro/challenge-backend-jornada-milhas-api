import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';
import { ConfigService } from '@nestjs/config';
import { CohereClient } from 'cohere-ai';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DestinationsService', () => {
  let service: DestinationsService;
  let destinationRepository: Repository<Destination>;

  const DESTINATION_REPOSITORY_TOKEN = getRepositoryToken(Destination);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        {
          provide: DESTINATION_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
    destinationRepository = module.get<Repository<Destination>>(
      DESTINATION_REPOSITORY_TOKEN,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('destinationRepository should be defined', () => {
    expect(destinationRepository).toBeDefined();
  });

  describe('create', () => {
    const mockDestination = {
      name: 'Test Destination',
      photos: [
        { url: 'http://images/photo1.jpg', description: 'destination image' },
      ],
      target: 'A destination target',
    };

    it('should create a destination with AI auto-generating text if descriptive text is not provided', async () => {
      const expectedAIText = 'Text generated by Cohere AI';
      jest.spyOn(service, 'generateText').mockResolvedValue(expectedAIText);

      await service.create(mockDestination);

      expect(destinationRepository.save).toHaveBeenCalledWith({
        ...mockDestination,
        descriptiveText: expectedAIText,
      });
    });

    it('should call destinationRepository.save with correct params', async () => {
      const result = {
        ...mockDestination,
        descriptiveText: 'Descriptive text',
      };

      await service.create(result);

      expect(destinationRepository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('generateText', () => {
    it('should return an AI auto-generating text', async () => {
      const expectedText = 'Text generated by Cohere AI';
      CohereClient.prototype.chat = jest
        .fn()
        .mockResolvedValue({ text: expectedText });

      const result = await service.generateText('Some prompt');

      expect(CohereClient.prototype.chat).toHaveBeenCalled();
      expect(result).toStrictEqual(expectedText);
    });
  });

  describe('findAll', () => {
    it('should throw an error if destination not found', async () => {
      jest.spyOn(destinationRepository, 'find').mockResolvedValueOnce([]);

      const result = service.findAll();

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Any destination was found');
    });
  });

  describe('findOne', () => {
    it('should throw an error if destination not found', async () => {
      jest.spyOn(destinationRepository, 'findOne').mockResolvedValueOnce(null);

      const result = service.findOne('uuid');

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Destination not found');
    });
  });

  describe('update', () => {
    it('should throw an error if destination not found', async () => {
      jest
        .spyOn(destinationRepository, 'update')
        .mockResolvedValueOnce({ affected: 0, generatedMaps: [], raw: '' });

      const result = service.update('uuid', { name: 'Lisbon' });

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Destination not found');
    });
  });

  describe('remove', () => {
    it('should throw an error if destination not found', async () => {
      jest
        .spyOn(destinationRepository, 'delete')
        .mockResolvedValueOnce({ affected: 0, raw: '' });

      const result = service.remove('uuid');

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Destination not found');
    });
  });
});
