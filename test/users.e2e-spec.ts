import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModuleTest } from './app.module.spec';
import { JwtService } from '@nestjs/jwt';
import { useContainer } from 'class-validator';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let jwtService: JwtService;
  let accessToken: string;

  const USER_URL = '/users';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTest]
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    useContainer(app.select(AppModuleTest), { fallbackOnErrors: true });

    await app.init();

    const userResponse = await request(app.getHttpServer())
      .post(USER_URL)
      .send({
        firstName: 'Jana',
        lastName: 'Doe',
        photo: { url: 'profile.jpg' },
        email: 'jane@mail.com',
        password: 'Abc-123',
      });

    userId = userResponse.body.id;

    // Generate an access token
    jwtService = moduleRef.get<JwtService>(JwtService);
    accessToken = await jwtService.signAsync({ userId });
  });

  describe('/POST users', () => {
    it('should return status of 201', () => {
      return request(app.getHttpServer())
        .post(USER_URL)
        .send({
          firstName: 'Jack',
          lastName: 'Sparrow',
          photo: { url: 'profile.jpg' },
          email: 'sparrow@mail.com',
          password: 'Abc-123',
        })
        .expect(201);
    });

    it('should return a 400 when give an email that already exists', () => {
      return request(app.getHttpServer())
        .post(USER_URL)
        .send({
          firstName: 'Jack',
          lastName: 'Sparrow',
          photo: { url: 'profile.jpg' },
          email: 'sparrow@mail.com',
          password: 'Abc-123',
        })
        .expect(400);
    });

    it('should return a 400 when password is less than 6 characters', () => {
      return request(app.getHttpServer())
        .post(USER_URL)
        .send({
          firstName: 'Jana',
          lastName: 'Doe',
          photo: { url: 'profile.jpg' },
          email: 'jane@mail.com',
          password: '123',
        })
        .expect(400);
    });

    it('should return a 400 when receives an invalid email', () => {
      return request(app.getHttpServer())
        .post(USER_URL)
        .send({
          firstName: 'Jana',
          lastName: 'Doe',
          photo: { url: 'profile.jpg' },
          email: 'jane',
          password: '123123',
        })
        .expect(400);
    });

    it('should return a 400 when receives an invalid value to isActive property', () => {
      return request(app.getHttpServer())
        .post(USER_URL)
        .send({
          firstName: 'Jana',
          lastName: 'Doe',
          photo: { url: 'profile.jpg' },
          email: 'jane@mail.com',
          password: '123123',
          isActive: 'invalidValue',
        })
        .expect(400);
    });

    it('should return a 400 when receives an invalid object into photo property', () => {
      return request(app.getHttpServer())
        .post(USER_URL)
        .send({
          firstName: 'Jana',
          lastName: 'Doe',
          photo: { invalid: 'profile.jpg' },
          email: 'jane@mail.com',
          password: '123123',
        })
        .expect(400);
    });
  });

  describe('/GET users', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .get(USER_URL)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });
  });

  describe('/GET/:id users', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .get(`${USER_URL}/${userId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should return a 400 when ID was not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .get(`${USER_URL}/123`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('uuid is expected');
    });

    it('should return a 404 when the user does not exists', async () => {
      const invalidUserId = '021f7fb8-a6bd-49a9-b571-85f68640e370';

      const response = await request(app.getHttpServer())
        .get(`${USER_URL}/${invalidUserId}`)
        .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(
        `User not found`,
      );
    });
  });

  describe('/PATCH users', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .patch(`${USER_URL}/${userId}`)
        .auth(accessToken, { type: 'bearer' })
        .send({ firstName: 'Jane' })
        .expect(200);
    });

    it('should update the property photo successfully', async () => {
      const updatedPhoto = {
        url: 'new-profile.jpg',
        description: 'new profile image',
      };

      await request(app.getHttpServer())
        .patch(`${USER_URL}/${userId}`)
        .auth(accessToken, { type: 'bearer' })
        .send({ photo: updatedPhoto })
        .expect(200);

      const response = await request(app.getHttpServer())
      .get(`${USER_URL}/${userId}`)
      .auth(accessToken, { type: 'bearer' });

      expect(response.body.photo.url).toEqual(updatedPhoto.url);
      expect(response.body.photo.description).toEqual(
        updatedPhoto.description,
      );
    });

    it('should return a 400 when ID was not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .patch(`${USER_URL}/123`)
        .auth(accessToken, { type: 'bearer' })
        .send({ firstName: 'Jane' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('uuid is expected');
    });

    it('should return a 404 when the user does not exists', async () => {
      const invalidUserId = '021f7fb8-a6bd-49a9-b571-85f68640e370';

      const response = await request(app.getHttpServer())
        .patch(`${USER_URL}/${invalidUserId}`)
        .auth(accessToken, { type: 'bearer' })
        .send({ firstName: 'Jane' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(
        `User not found`,
      );
    });
  });

  describe('/DELETE users', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .delete(`${USER_URL}/${userId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should return a 400 when ID was not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
      .delete(`${USER_URL}/123`)
      .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch('uuid is expected');
    });

    it('should return a 404 when the user does not exists', async () => {
      const invalidUserId = '021f7fb8-a6bd-49a9-b571-85f68640e370';

      const response = await request(app.getHttpServer())
      .delete(`${USER_URL}/${invalidUserId}`)
      .auth(accessToken, { type: 'bearer' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(
        `User with ID ${invalidUserId} not found`,
      );
    });
  });
});
