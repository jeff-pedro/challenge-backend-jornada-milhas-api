import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { SwaggerDocumentBuilder } from './swagger/swagger-document-builder';
import { APP_DEFAULTS } from './config/constants/app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });

  app.setGlobalPrefix(APP_DEFAULTS.GLOBAL_PREFIX);

  const swaggerDocumentBuilder = new SwaggerDocumentBuilder(app);
  swaggerDocumentBuilder.setupSwagger();

  const configService = app.get(ConfigService<{ app: { port: number } }, true>);
  const port = configService.get('app.port', { infer: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allows injecting dependencies into custom validator classes
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true
  });

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
