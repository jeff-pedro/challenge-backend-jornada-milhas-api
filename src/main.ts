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

  app.setGlobalPrefix('/api/v1');

  const { version, description, author } = require('../package.json');
  const config = new DocumentBuilder()
    .setTitle('Jornada Milhas API')
    .setDescription(description)
    .setVersion(version)
    .setContact('🧑🏽‍💻 Development', author.url, author.email)
    .setExternalDoc(
      '📚 More about the project...', 
      'https://github.com/jeff-pedro/challenge-backend-jornada-milhas/wiki'
    )
    .addBearerAuth()
    .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory, {
      useGlobalPrefix: true,
      customSiteTitle: 'JM Documentation',
      customfavIcon: '/static/logo.png'
    });

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
