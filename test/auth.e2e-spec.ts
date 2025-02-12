import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../src/modules/users/users.service';
import { AppModuleTest } from './app.module.spec';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const LOGIN_URL = '/auth/login'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTest],
    })
      .overrideProvider(UsersService)
      .useValue({
        findByEmail: jest.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: await bcrypt.hash('123456', 10),
          firstName: 'John',
          lastName: 'Doe',
        }),
      })
      .overrideProvider(JwtService)
      .useValue({
        signAsync: jest.fn().mockResolvedValue('accessToken'),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST auth/login should return status of 200', () => {
    return request(app.getHttpServer())
      .post(LOGIN_URL)
      .send({ email: 'test@example.com', password: '123456' })
      .expect(200)
      .expect({ access_token: 'accessToken' });
  });

  it('/POST auth/login should return status of 401 for invalid credentials', () => {
    return request(app.getHttpServer())
      .post(LOGIN_URL)
      .send({ email: 'test@example.com', password: 'wrongPassword' })
      .expect(401);
  });
});
