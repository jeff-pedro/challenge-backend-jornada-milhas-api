import { Test, TestingModule } from '@nestjs/testing';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './entities/testimonial.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';
import { Photo } from '../photos/entities/photo.entity';

describe('TestimonialsService', () => {
  let service: TestimonialsService;
  let testimonialRepository: Repository<Testimonial>;
  let userRepository: Repository<User>;

  const TESTIMONIAL_REPOSITORY_TOKEN = getRepositoryToken(Testimonial);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Wick',
    email: 'john@gmail.com',
    isActive: true,
    photo: new Photo(),
    password: '123',
    testimonials: [],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    deletedAt: '2023-01-01',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestimonialsService,
        {
          provide: TESTIMONIAL_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(() => mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<TestimonialsService>(TestimonialsService);
    testimonialRepository = module.get<Repository<Testimonial>>(
      TESTIMONIAL_REPOSITORY_TOKEN,
    );
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('testimonialRepository should be defined', () => {
    expect(testimonialRepository).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    const mockTestimonial = new Testimonial();
    Object.assign(mockTestimonial, {
      testimonial: 'Text',
      user: mockUser,
    });

    it('should call testimonialRepository.save with correct params', async () => {
      jest
        .spyOn(testimonialRepository, 'save')
        .mockResolvedValue(mockTestimonial);

      await service.create({
        userId: '1',
        testimonial: 'Text',
      });

      expect(testimonialRepository.save).toHaveBeenCalledWith(mockTestimonial);
    });

    it('should call userRepository with correct params', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest
        .spyOn(testimonialRepository, 'save')
        .mockResolvedValue(mockTestimonial);

      await service.create({
        userId: '1',
        testimonial: 'Text',
      });

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should create and return the correct object', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest
        .spyOn(testimonialRepository, 'save')
        .mockResolvedValue(mockTestimonial);

      const result = await service.create({
        userId: '1',
        testimonial: 'Text',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('testimonial');
    });

    it('should throw an error if testimonial not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      const result = service.create({
        userId: '1',
        testimonial: 'Text',
      });

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('User not found');
    });
  });

  describe('findAll', () => {
    it('should throw an error if testimonial not found', async () => {
      jest.spyOn(testimonialRepository, 'find').mockResolvedValueOnce([]);

      const result = service.findAll();

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Any testimonial was found');
    });
  });

  describe('findOne', () => {
    it('should throw an error if testimonial not found', async () => {
      jest.spyOn(testimonialRepository, 'findOne').mockResolvedValueOnce(null);

      const result = service.findOne('invalid-id');

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Testimonial not found');
    });
  });

  describe('update', () => {
    it('should throw an error if testimonial not found', async () => {
      jest
        .spyOn(testimonialRepository, 'update')
        .mockResolvedValueOnce({ affected: 0, generatedMaps: [], raw: '' });

      const result = service.update('invalid-id', {
        testimonial: 'Some testimonial',
      });

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Testimonial not found');
    });
  });

  describe('remove', () => {
    it('should throw an error if testimonial not found', async () => {
      jest
        .spyOn(testimonialRepository, 'delete')
        .mockResolvedValueOnce({ affected: 0, raw: '' });

      const result = service.remove('invalid-id');

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Testimonial not found');
    });
  });

  describe('getRandomTestimonials', () => {
    it('should call testimonialRepository.find with correct params', async () => {
      const options = { order: { id: 'ASC' }, take: 3 };

      await service.getRandomTestimonials();

      expect(testimonialRepository.find).toHaveBeenCalledWith(options);
    });
  });
});
