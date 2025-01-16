import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { validate } from '../src/validations/env.validation';

describe('AppModule', () => {
  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should validate environment variables', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.COHERE_API_KEY = 'test-api-key';

    expect(() => validate(process.env)).not.toThrow();
  });

  it('should throw an error for invalid environment variables', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '-1';
    process.env.COHERE_API_KEY = '';

    expect(() => validate(process.env)).toThrow();
  });
});
