import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Photo } from '../photos/entities/photo.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('update', () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      photo: { id: 1, url: 'oldurl.jpg' },
    } as User;

    const updateUserDto = {
      firstName: 'Jane',
      photo: { url: 'newurl.jpg' },
    } as UpdateUserDto;

    const mockUpdatedUser = {
      ...mockUser,
      ...updateUserDto,
      photo: { ...mockUser.photo, ...updateUserDto.photo },
    } as User;

    it('should call userRepository.findOne with correct params', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUpdatedUser);
      
      await service.update('1', updateUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['photo'],
      });
    });

    it('should call userRepository.save with correct params', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUpdatedUser);

      await service.update('1', updateUserDto);

      expect(userRepository.save).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['photo'],
      });
    });
  });

  describe('findOne', () => {
    it('should call userRepository.findOne with correct params', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        photo: { id: 1, url: 'url.jpg' },
      } as User;

      const expectedParams = {
        where: { id: mockUser.id },
        relations: ['photo'],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      await service.findOne('1');

      expect(userRepository.findOne).toHaveBeenCalledWith(expectedParams);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      expect(service.findOne('1')).rejects.toBeInstanceOf(NotFoundException);
      expect(service.findOne('1')).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should call userRepository.findOne with correct params', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@mail.com',
        photo: { id: 1, url: 'url.jpg' },
      } as User;

      const expectedParams = {
        where: { email: mockUser.email },
        relations: ['photo'],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      await service.findByEmail('john@mail.com');

      expect(userRepository.findOne).toHaveBeenCalledWith(expectedParams);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      expect(service.findOne('1')).rejects.toBeInstanceOf(NotFoundException);
      expect(service.findOne('1')).rejects.toThrow('User not found');
    });
  });

  describe('findAll', () => {
      const mockUsers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          photo: { id: 1, url: 'url.jpg' },
        },
      ] as User[];

      const expectedParams = {
        relations: ['photo'],
        select: { photo: { url: true } },
        skip: 0,
        take: 1,
      };

      const queryParams = { page: 1, limit: 1 }

    it('should call userRepository.find with correct params', async () => {
      jest.spyOn(userRepository, 'findAndCount').mockResolvedValueOnce([ mockUsers, 1 ]);

      await service.findAll(queryParams);

      expect(userRepository.findAndCount).toHaveBeenCalledWith(expectedParams);
    });

    it('should throw NotFoundException if any user was found', async () => {
      const queryParams = { page: 1, limit: 1 }
      jest.spyOn(userRepository, 'findAndCount').mockResolvedValueOnce([ [], 1 ]);

      const result = service.findAll(queryParams);

      expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).rejects.toThrow('Any user was found');
    });
  });

  describe('attachPhoto', () => {
    const mockUser = { id: '1', photo: new Photo() } as User;
    const file = {} as Express.Multer.File;
    
    it('should call userRepository.findOne with correct params', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      // Act
      await service.attachPhoto('1', file);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['photo'],
      });
    });

    it('should call userRepository.save with correct params', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      await service.attachPhoto('1', file);

      expect(userRepository.save).toHaveBeenCalledTimes(1);  
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should return the updated photo', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const response = await service.attachPhoto('1', file);

      expect(response).toBe(mockUser.photo);  
    });

    it('should return the saved photo', async () => {
      const mockUser = { id: '1' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const response = await service.attachPhoto('1', file);

      expect(response).toBe(mockUser.photo);  
    })
  })
});
