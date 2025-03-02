import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });

  const { version, homepage, description, author } = require('../package.json');

  const config = new DocumentBuilder()
    .setTitle('Jornada Milhas API')
    .setDescription(description)
    .setVersion(version)
    .setContact('Development contact', homepage, author.email)
    .setExternalDoc('Github Wiki', 'https://github.com/jeff-pedro/challenge-backend-jornada-milhas/wiki')
    .addBearerAuth()
    .build();
    
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

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
