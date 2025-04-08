import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModuleTest } from './app.module.spec';
import { Repository } from 'typeorm';
import { Photo } from '../src/modules/photos/entities/photo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IAService } from 'src/modules/ai/interfaces/ai.service.interface';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let photoRepository: Repository<Photo>;
  let iaService: IAService;

  const PHOTO_REPOSITORY_TOKEN = getRepositoryToken(Photo);

  const PHOTO_URL = '/photos'

  const mockPhoto = {
    id: 1,
    url: 'https://example.com/test.jpg',
    description: ''
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTest],
    })
      .overrideProvider('IAService')
      .useValue({
        generateText: jest.fn().mockResolvedValue('AI generated description')
      })
      .compile();

    app = moduleFixture.createNestApplication();
    photoRepository = moduleFixture.get<Repository<Photo>>(PHOTO_REPOSITORY_TOKEN);
    iaService = moduleFixture.get('IAService')

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET/:id photos', () => {
    it('should return status of 200', async () => {
      // Arrange
      await photoRepository.save(mockPhoto);

      // Act
      return request(app.getHttpServer())
        .get(`${PHOTO_URL}/${mockPhoto.id}`)
        .expect(200); // Assert
    });
  });

  describe('/PATCH/:id/description photos', () => {
    it('should update photo description using AI', async () => {
      // Arrange
      await photoRepository.save(mockPhoto);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`${PHOTO_URL}/${mockPhoto.id}/description`)
        .send()
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        id: mockPhoto.id,
        url: mockPhoto.url,
        description: 'AI generated description'
      });

      expect(iaService.generateText).toHaveBeenCalled();
    });

    it('should return 404 when photo not found', async () => {
      await request(app.getHttpServer())
      .patch(`${PHOTO_URL}/999/description`)
      .expect(404);
    });
  });
});
