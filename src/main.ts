import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { SwaggerDocumentBuilder } from './swagger/swagger-document-builder';
import { APP_DEFAULTS } from './config/constants/app.constants';

function setupAplication(app: INestApplication) {
  app.setGlobalPrefix(APP_DEFAULTS.GLOBAL_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allows injecting dependencies into custom validator classes
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });

  setupAplication(app);
    
  const swaggerDocumentBuilder = new SwaggerDocumentBuilder(app);
  swaggerDocumentBuilder.setupSwagger();
  
  const configService = app.get(ConfigService<{ app: { port: number } }, true>);
  const port = configService.get('app.port', { infer: true });


  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
