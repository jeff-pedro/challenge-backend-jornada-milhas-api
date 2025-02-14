import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModuleTest } from './app.module.spec';
import { JwtService } from '@nestjs/jwt';
import { useContainer } from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Testimonial } from '../src/modules/testimonials/entities/testimonial.entity';

describe('TestimonialsController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let testimonialId: string;
  let jwtService:JwtService;
  let accessToken: string;
  let userRepository: Repository<User>;
  let testimonialRepository: Repository<Testimonial>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const TESTIMONIAL_REPOSITORY_TOKEN = getRepositoryToken(Testimonial);
  
  const TESTIMONIAL_URL = '/testimonials';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTest],
    }).compile();

    app = moduleRef.createNestApplication();

    useContainer(app.select(AppModuleTest), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    userRepository = moduleRef.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    testimonialRepository = moduleRef.get<Repository<Testimonial>>(TESTIMONIAL_REPOSITORY_TOKEN);

    const user = await userRepository.save({
      firstName: 'Jane',
      lastName: 'Doe',
      photo: { url: 'profile.jpg', description: 'my profile image' },
      email: 'jane@mail.com',
      password: 'Abc-123',
    });

    userId = user.id;
    
    // Gerenare testimonials
    for await (const i of Array(4).keys()) {
      await testimonialRepository.save({
        testimonial: 'Some testimonial',
        user,
      });
    }
    testimonialId = (await testimonialRepository.find())[0].id;

    // Generate access token
    jwtService = moduleRef.get<JwtService>(JwtService);
    accessToken = await jwtService.signAsync({ sub: userId })
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST testimonials', () => {
    it('should create a new testimonial', async () => {
      return request(app.getHttpServer())
        .post(TESTIMONIAL_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({ testimonial: 'Some testimonial' })
        .expect(201);
    });

    it('should return a 400 when testimonial property was not provided', async () => {
      return request(app.getHttpServer())
        .post(TESTIMONIAL_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({})
        .expect(400);
    });

    it('should return an error when testimonial property is empty', async () => {
      const response = await request(app.getHttpServer())
        .post(TESTIMONIAL_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({ testimonial: '' });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe('testimonial should not be empty');
    });

    it('should return an error when provided a non-existent property', async () => {
      const response = await request(app.getHttpServer())
        .post(TESTIMONIAL_URL)
        .auth(accessToken, { type: 'bearer' })
        .send({ testimonial: 'Some testimonial.', nonExistentProperty: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.any(Array),
          error: expect.any(String),
          statusCode: 400,
        }),
      );
    });
  });

  describe('/GET testimonials', () => {
    it('should return status of 200', async () => {
      return await request(app.getHttpServer())
        .get(TESTIMONIAL_URL)
        .expect(200);
    });
  });

  describe('/GET/:id testimonials', () => {
    it('should return status of 200', () => {
      return request(app.getHttpServer())
        .get(`${TESTIMONIAL_URL}/${testimonialId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should return status of 400', () => {
      return request(app.getHttpServer())
        .get(`${TESTIMONIAL_URL}/123`)
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });
  });

  describe('/PUT testimonials', () => {
    it('should return status of 200', async () => {
      return request(app.getHttpServer())
        .patch(`${TESTIMONIAL_URL}/${testimonialId}`)
        .auth(accessToken, { type: 'bearer' })
        .send({ testimonial: 'Testimonial updated.' })
        .expect(200);
    });
  });

  describe('/DELETE testimonials', () => {
    it('should return status 200', async () => {
      return request(app.getHttpServer())
        .delete(`${TESTIMONIAL_URL}/${testimonialId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });
  });

  describe('/GEt testimonials-home', () => {
    it('should return an array with 3 random testimonial objects', async () => {
      const response = await request(app.getHttpServer())
        .get('/testimonials-home')
        .auth(accessToken, { type: 'bearer' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
    });
  });
});
