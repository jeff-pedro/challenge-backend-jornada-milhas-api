import { Test } from '@nestjs/testing';
import { AppModuleTest } from './app.module.spec';
import { validate } from '../src/common/validations/env.validation';


describe('AppModule', () => {
  const originalEnv = process.env;

  beforeEach(async () => {
    // Clone the original environment variables
    process.env = { ...originalEnv };

    await Test.createTestingModule({
      imports: [AppModuleTest],
    }).compile();
  });

  afterEach(() => {
    // Restore the original environment variables
    process.env = originalEnv;
  });
  
  it('should validate environment variables', () => {
    // first test .env* file
    expect(() => validate(process.env)).not.toThrow();
  });
  
  it('should throw an error for invalid NODE_ENV variable', () => {
    process.env.NODE_ENV = 'invalid_env';
    expect(() => validate(process.env)).toThrow();
  });
  
  it('should throw an error for invalid PORT env variable', () => {
    process.env.PORT = '-1';
    expect(() => validate(process.env)).toThrow();
  });

  it('should throw an error fwhen missing GEMINI_API_KEY env variable', () => {
    delete process.env.GEMINI_API_KEY;
    expect(() => validate(process.env)).toThrow();
  });

  it('should throw an error when missing HASH_SALT env variable', () => {
    delete process.env.HASH_SALT;
    expect(() => validate(process.env)).toThrow();
  });
});
