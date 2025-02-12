import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModuleTest } from './app.module.spec';
import { JwtService } from '@nestjs/jwt';

describe('DestinationsController (e2e)', () => {
  let app: INestApplication;
  let destinationId: string;
  let destinationName: string;
  let jwtService: JwtService;
  let accessToken: string;

  const DESTINATION_URL = '/destinations';

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

    // Generate access token
    jwtService = moduleRef.get<JwtService>(JwtService);
    accessToken = await jwtService.signAsync({ sub: 'test-user-id' });

    const destinatioResponse = await request(app.getHttpServer())
      .post(DESTINATION_URL)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'Berlin',
        photos: [{ url: 'berlin.jpg' }],
        target: 'Go to Berlin in 2025',
        descriptiveText: 'Some descriptive text about Berlin...',
      });

    destinationId = destinatioResponse.body.id;
    destinationName = destinatioResponse.body.name;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST destinations', () => {
    it('should return status of 201', async () => {
      return request(app.getHttpServer())
        .post(DESTINATION_URL)
        .send({
          name: 'Amsterdam',
          photos: [{ url: 'amsterdam1.jpg' }, { url: 'amsterdam2.jpg' }],
          target: 'Go to Amsterdam in 2030',
          descriptiveText: 'Some descriptive text about Amsterdam...',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(201);
    });

    it('should return an error when receiving invalid type data', async () => {
      const res = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .send({
          photos: true,
          name: 1,
          price: '4500.00',
        })
        .auth(accessToken, { type: 'bearer' });

      expect(res.body).toEqual(
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
      ['descriptiveText', ''],
    ])(
      'should return an error when the %s property is empty',
      async (key, value) => {
        const destinationDto = {
          name: 'Amsterdam',
          photos: [{ url: 'amsterdam1.jpg' }, { url: 'amsterdam2.jpg' }],
          target: 'Go to Amsterdam in 2030',
          descriptiveText: 'Some descriptive text about Amsterdam...',
        };
        Object.assign(destinationDto, { [key]: value });

        const res = await request(app.getHttpServer())
          .post(DESTINATION_URL)
          .auth(accessToken, { type: 'bearer' })
          .send(destinationDto);

        expect(res.status).toBe(400);
        expect(res.body.message[0]).toBe(`${key} should not be empty`);
      },
    );

    it('should return an error when passing more than 2 photos to the array', async () => {
      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Amsterdam',
          photos: [
            { url: 'photo1.jpg' },
            { url: 'photo1.jpg' },
            { url: 'photo1.jpg' },
          ],
          target: 'Go to Amsterdam in 2030',
          descriptiveText: 'Some descriptive text about Amsterdam...',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'photos must contain no more than 2 elements',
      );
    });

    it('should return an error when passing less than 1 photo to the array', async () => {
      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Amsterdam',
          photos: [],
          target: 'Go to Amsterdam in 2030',
          descriptiveText: 'Some descriptive text about Amsterdam...',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'photos must contain at least 1 elements',
      );
    });

    it('should return an error when passing a non-existent property', async () => {
      const response = await request(app.getHttpServer())
        .post(DESTINATION_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Amsterdam',
          photos: [{ url: 'photo1.jpg' }],
          target: 'Go to Amsterdam in 2030',
          descriptiveText: 'Some descriptive text about Amsterdam...',
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
        .send({
          name: 'Amsterdam',
          photos: [{ url: 'photo1.jpg' }],
          target,
          descriptiveText: 'Some descriptive text about Amsterdam...',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe(
        'target must be shorter than or equal to 160 characters',
      );
    });
  });

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
