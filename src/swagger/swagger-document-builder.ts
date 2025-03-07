import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { APP_DEFAULTS, SWAGGER_URL } from "src/config/constants/app.constants";
import { SwaggerUI } from "./swagger-ui.class";
import { ConfigService } from "@nestjs/config";

const { version, description, author } = require('../../package.json');

export class SwaggerDocumentBuilder {
  private readonly configService: ConfigService;
  
  constructor(
    private readonly app: INestApplication<any>,
  ) {
    this.configService = app.get(ConfigService);
  }

  private buildConfig() {
    const docBuilder = new DocumentBuilder()
      .setTitle(APP_DEFAULTS.NAME)
      .setDescription(description)
      .setVersion(version)
      .setContact('🧑🏽‍💻 Development', author.url, author.email)
      .setExternalDoc(
        '📚 More about the project...',
        'https://github.com/jeff-pedro/challenge-backend-jornada-milhas/wiki'
      )
      .addBearerAuth({
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        in: 'header'
      }, 'JWTAuthorization');

      return docBuilder.build();
  }

  private createDocument() {
    const config = this.buildConfig();
    return SwaggerModule.createDocument(this.app, config);
  }

  public setupSwagger() {
    const document = this.createDocument();
    const baseUrl = this.configService.get<string>('APP_URL') || APP_DEFAULTS.URL;
    const applicationUrl = `${baseUrl}/${APP_DEFAULTS.GLOBAL_PREFIX}`;
    console.log(applicationUrl);
    
    const swaggerUI = new SwaggerUI(applicationUrl);
    SwaggerModule.setup(
      this.configService.get<string>('SWAGGER_URL') || SWAGGER_URL,
      this.app,
      document,
      swaggerUI.customOptions,
    );
  }
}