import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { GoogleGenerativeAIError } from '@google/generative-ai';
import { UnauthorizedException } from '@nestjs/common';

// Disable console.error
global.console.error = jest.fn();

// Mock do GoogleGenerativeAI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn()
      })
    })),
    GoogleGenerativeAIError: jest.requireActual('@google/generative-ai').GoogleGenerativeAIError
  };
});

describe('GeminiService', () => {
  let service: GeminiService;
  let configService: ConfigService;
  let mockModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
    configService = module.get<ConfigService>(ConfigService);
    mockModel = (service as any).model;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateDescription', () => {
    it('should return generated description successfully', async () => {
      const expectedResponse = 'Generated description';
      mockModel.generateContent.mockResolvedValueOnce({
        response: { text: () => expectedResponse }
      });

      const result = await service.generateText('Test prompt');

      expect(result).toBe(expectedResponse);
      expect(mockModel.generateContent).toHaveBeenCalledWith('Test prompt');
    });

    it('should return "Text unavailable" when response is empty', async () => {
      mockModel.generateContent.mockResolvedValueOnce({
        response: { text: () => '' }
      });

      const result = await service.generateText('Test prompt');

      expect(result).toBe('Text unavailable');
    });
  });
});