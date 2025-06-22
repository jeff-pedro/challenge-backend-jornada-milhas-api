import * as request from 'supertest';
import * as path from 'path';
import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModuleTest } from './app.module.spec';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Destination } from '../src/modules/destinations/entities/destination.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDestinationDto } from 'src/modules/destinations/dto/create-destination.dto';

describe('DestinationsController (e2e)', () => {
  let app: INestApplication;
  let destinationRepository: Repository<Destination>;
  let destinationId: string;
  let destinationName: string;
  let jwtService: JwtService;
  let accessToken: string;

  const DESTINATION_URL = '/destinations';
  const DESTINATION_REPOSITORY_TOKEN = getRepositoryToken(Destination);

  const mockDestination: CreateDestinationDto = {
    name: 'Germany',
    target: 'Go to Germany in 2025',
    price: 8000,
    description: {
      text: 'Some descriptive text about Germany...',
      title: 'Title about text',
      subtitle: 'Subtitle about text'
    },
  }

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTest],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    
    destinationRepository = moduleRef.get<Repository<Destination>>(DESTINATION_REPOSITORY_TOKEN);
    
    // Generate access token
    jwtService = moduleRef.get<JwtService>(JwtService);
    accessToken = await jwtService.signAsync({ sub: 'test-user-id' });

    const { id, name } = await destinationRepository.save({
      name: 'New York',
      target: 'Go to New York in 2025',
      price: 5000,
      description: {
        text: 'Some descriptive text about New York...',
        title: 'Title about text',
        subtitle: 'Subtitle about text'
      }
    });

    destinationId = id;
    destinationName = name;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST destinations', () => {
    it('should return status of 201', async () => {
      return request(app.getHttpServer())
        .post(DESTINATION_URL)
        .send(mockDestination)
        .auth(accessToken, { type: 'bearer' })
        .expect(201);
    });

    it('should return destination.description created by AI', async () => {
      let destination = { ...mockDestination };
      delete destination.description;

      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .send(destination)
        .auth(accessToken, { type: 'bearer' })
        .expect(201);

      expect(response.body.description).toHaveProperty('text');
      expect(response.body.description.text.length > 0).toBeTruthy()
      expect(response.body.description).toHaveProperty('title');
      expect(response.body.description.title.length > 0).toBeTruthy()
      expect(response.body.description).toHaveProperty('subtitle');
      expect(response.body.description.subtitle.length > 0).toBeTruthy()
    });

    it('should return an error when receiving invalid type data', async () => {
      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .send({
          price: 'invalid value',
        })
        .auth(accessToken, { type: 'bearer' });

      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.any(Array),
          error: expect.any(String),
          statusCode: 400,
        }),
      );
    });

    it.each([
      ['name', ''],
      ['target', ''],
    ])(
      'should return an error when the %s property is empty',
      async (key, value) => {
        const destination = { ...mockDestination };
        Object.assign(destination, { [key]: value });
        
        const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
          .auth(accessToken, { type: 'bearer' })
          .send(destination);
        
        expect(response.status).toBe(400);
        expect(response.body.message[0]).toBe(`${key} should not be empty`);
      },
    );

    it('should return an error when passing a non-existent property', async () => {
      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({
          ...mockDestination,
          nonExistentProperty: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'property nonExistentProperty should not exist',
      );
    });

    it('should return an error when the target receives more than 160 characters', async () => {
      const target = 'x'.repeat(161);

      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({ ...mockDestination, target });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'target must be shorter than or equal to 160 characters',
      );
    });

    it.each([
      ['text', ''],
      ['title', ''],
      ['subtitle', '']
    ])('should return an error when the description property %s is empty', async (key, value) => {
      const destination = { ...mockDestination };
      Object.assign(destination, { 
        description: {
          ...destination.description,
          [key]: value
        }
      });

      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .auth(accessToken, { type: 'bearer' })
        .send(destination);

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(`description.${key} should not be empty`);
    });
  });

  describe('/POST destination/{id}/upload', () => {
    it('should return status of 201', async () => {
      const filePath = path.join(__dirname, 'test.jpg');
      // Create a large file for testing
      fs.writeFileSync(filePath, 'a'.repeat(1024));
      
      return request(app.getHttpServer())
        .post(`${DESTINATION_URL}/${destinationId}/upload`)
        .auth(accessToken, { type: 'bearer' })
        .attach('files', filePath)
        .expect(201)
        .then(() => {
          // Clean up the file after the test
          fs.unlinkSync(filePath);
        });
    });

    it('should return error when a file is not attached', async () => {
      return request(app.getHttpServer())
        .post(`${DESTINATION_URL}/${destinationId}/upload`)
        .auth(accessToken, { type: 'bearer' })
        .attach('files', '')
        .expect(422);
    });

    it('should return error when receiving an invalid image format', async () => {
      const filePath = path.join(__dirname, 'test.txt');
      // Create a large file for testing
      fs.writeFileSync(filePath, 'a'.repeat(1024));
      
      return request(app.getHttpServer())
        .post(`${DESTINATION_URL}/${destinationId}/upload`)
        .auth(accessToken, { type: 'bearer' })
        .attach('files', filePath)
        .expect(422)
        .then(() => {
          // Clean up the file after the test
          fs.unlinkSync(filePath);
        });
    });

    it('should return error when file size is gretter than 5MB', async () => {
      const largeFilePath = path.join(__dirname, 'large-test.jpg');
      // Create a large file for testing
      fs.writeFileSync(largeFilePath, 'a'.repeat(1024 * 1024 * 6)); // 6MB file

      return request(app.getHttpServer())
        .post(`${DESTINATION_URL}/${destinationId}/upload`)
        .auth(accessToken, { type: 'bearer' })
        .attach('files', largeFilePath)
        .expect(422)
        .then(() => {
          // Clean up the large file after the test
          fs.unlinkSync(largeFilePath);
        })
    });
  })

  describe('/GET destinations', () => {
    it('should return status of 200', async () => {
      return await request(app.getHttpServer())
        .get(DESTINATION_URL)
        .expect(200);
    });

    it('should return status 200 when receives via query params a valid destination name', () => {
      return request(app.getHttpServer())
        .get(`${DESTINATION_URL}/?name=${destinationName}`)
        .expect(200);
    });

    it('should return an error when receives via query params an non-existent destination name', async () => {
      const response = await request(app.getHttpServer())
      .get(`${DESTINATION_URL}/?name=NonExistentDestination`)

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Any destination was found');
    });
  });

  describe('/GET/:id destinations', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .get(`${DESTINATION_URL}/${destinationId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should return a 400 when ID was not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .get(`${DESTINATION_URL}/123`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('uuid is expected');
    });

    it('should return a 404 when the destination does not exists', async () => {
      const invalidDestinationId = '021f7fb8-a6bd-49a9-b571-85f68640e370';

      const response = await request(app.getHttpServer())
        .get(`${DESTINATION_URL}/${invalidDestinationId}`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch('Destination not found');
    });
  });

  describe('/PATCH destinations', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .patch(`${DESTINATION_URL}/${destinationId}`)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Pernambuco',
        })
        .expect(200);
    });

    it('should return a 400 when ID was not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .patch(`${DESTINATION_URL}/123`)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Pernambuco',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('uuid is expected');
    });

    it('should return a 404 when the destination does not exists', async () => {
      const invalidDestinationId = '021f7fb8-a6bd-49a9-b571-85f68640e370';

      const response = await request(app.getHttpServer())
        .patch(`${DESTINATION_URL}/${invalidDestinationId}`)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Pernambuco',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch('Destination not found');
    });
  });

  describe('/DELETE destinations', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .delete(`${DESTINATION_URL}/${destinationId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should return a 400 when ID was not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${DESTINATION_URL}/123`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('uuid is expected');
    });

    it('should return a 404 when the destination does not exists', async () => {
      const invalidDestinationId = '021f7fb8-a6bd-49a9-b571-85f68640e370';

      const response = await request(app.getHttpServer())
        .delete(`${DESTINATION_URL}/${invalidDestinationId}`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch('Destination not found');
    });
  });
});
