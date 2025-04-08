import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn(),
  createUserContent: jest.fn(),
  createPartFromUri: jest.fn(),
}));

describe('GeminiService', () => {
  let geminiService: GeminiService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    geminiService = module.get<GeminiService>(GeminiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should generate text without a file', async () => {
    const mockApiKey = 'mock-api-key';
    const mockModel = 'mock-model';
    const mockPrompt = 'Test prompt';
    const mockResponse = { text: 'Generated text' };

    configService.get = jest.fn((key: string) => {
      if (key === 'app.ai.apiKey') return mockApiKey;
      if (key === 'app.ai.model') return mockModel;
    });

    const mockGenerateContent = jest.fn().mockResolvedValue(mockResponse);
    (GoogleGenAI as jest.Mock).mockImplementation(() => ({
      models: { generateContent: mockGenerateContent },
    }));
    (createUserContent as jest.Mock).mockReturnValue([mockPrompt])

    const result = await geminiService.generateText(mockPrompt);

    expect(result).toBe('Generated text');
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: mockModel,
      contents: createUserContent([mockPrompt])
    });
  });

  it('should generate text with a file', async () => {
    const mockApiKey = 'mock-api-key';
    const mockModel = 'mock-model';
    const mockPrompt = 'Test prompt';
    const mockFile = new Blob(['file content']);
    const mockImage = { uri: 'mock-uri', mimeType: 'image/png' };
    const mockResponse = { text: 'Generated text with file' };

    configService.get = jest.fn((key: string) => {
      if (key === 'app.ai.apiKey') return mockApiKey;
      if (key === 'app.ai.model') return mockModel;
    });

    const mockUpload = jest.fn().mockResolvedValue(mockImage);
    const mockGenerateContent = jest.fn().mockResolvedValue(mockResponse);
    (GoogleGenAI as jest.Mock).mockImplementation(() => ({
      files: { upload: mockUpload },
      models: { generateContent: mockGenerateContent },
    }));
    (createUserContent as jest.Mock).mockReturnValue([{ text: mockPrompt }, mockImage]);

    const result = await geminiService.generateText(mockPrompt, mockFile);

    expect(result).toBe('Generated text with file');
    expect(mockUpload).toHaveBeenCalledWith({ file: mockFile });
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: mockModel,
      contents: [
        { text: mockPrompt },
        { uri: 'mock-uri', mimeType: 'image/png' },
      ],
    });
  });

  it('should return null and log an error if an exception occurs', async () => {
    const mockApiKey = 'mock-api-key';
    const mockPrompt = 'Test prompt';
    const mockError = new Error('Test error');

    configService.get = jest.fn((key: string) => {
      if (key === 'app.ai.apiKey') return mockApiKey;
    });

    const mockGenerateContent = jest.fn().mockRejectedValue(mockError);
    (GoogleGenAI as jest.Mock).mockImplementation(() => ({
      models: { generateContent: mockGenerateContent },
    }));

    const loggerSpy = jest.spyOn(geminiService['logger'], 'error').mockImplementation();

    const result = await geminiService.generateText(mockPrompt);

    expect(result).toBeNull();
    expect(loggerSpy).toHaveBeenCalledWith(mockError.message);
  });
});