import { SWAGGER_UI_CONSTANTS } from "./swagger-ui.constants";

interface SwaggerUIOptions {
  customCss: string;
  customSiteTitle: string;
  customfavIcon: string;
  swaggerOptions: {
    persistAuthorization: boolean;
  };
  useGlobalPrefix: boolean;
}

export class SwaggerUI {
  private static readonly SITE_TITLE = 'Jornada Milhas Docs';
  private static readonly ASSETS = {
    FAVICON: 'logo-orange.png',
    TOPBAR_ICON: 'logo-white-tagline.png'
  };

  private readonly _customOptions: SwaggerUIOptions;
  
  constructor(private readonly applicationUrl: string) {
    this._customOptions = this.buildCustomOptions(); 
  }

  private buildCustomOptions(): SwaggerUIOptions {
    return {
      customCss: this.generateCustomCss(),
      customSiteTitle: SwaggerUI.SITE_TITLE,
      customfavIcon: this.getAssetsUrl(SwaggerUI.ASSETS.FAVICON),
      swaggerOptions: {
        persistAuthorization: true,
      },
      useGlobalPrefix: true,
    }
  }

  public get customOptions(): SwaggerUIOptions {
    return this._customOptions;
  }

  private getAssetsUrl(filename: string): string {
    return `${this.applicationUrl}/wwwroot/swagger/assets/${filename}`;
  }

  private generateCustomCss(): string { 
    return `
      .topbar-wrapper {
        content:url('${this.getAssetsUrl(SwaggerUI.ASSETS.TOPBAR_ICON)}');
        width: 200px;
        height: auto;
      }
        
      .topbar-wrapper svg {
        visibility: hidden;
      }

      .swagger-ui .topbar {
        background-color: ${SWAGGER_UI_CONSTANTS.TOPBAR.BACKGROUND_COLOR};
      }

      .swagger-ui .opblock.opblock-get {
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.BACKGROUND_COLOR};
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.BORDER_COLOR};
      }

      .swagger-ui .opblock.opblock-get .opblock-summary-method {
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.SUMMARY_COLOR};
      }

      .swagger-ui .opblock.opblock-post {
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.BACKGROUND_COLOR};
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.BORDER_COLOR};
      }

      .swagger-ui .opblock.opblock-post .opblock-summary-method {
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.SUMMARY_COLOR};
      }

      .swagger-ui .opblock.opblock-delete {
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.BACKGROUND_COLOR};
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.BORDER_COLOR};
      }

      .swagger-ui .opblock.opblock-delete .opblock-summary-method {
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.SUMMARY_COLOR};
      }

      .swagger-ui .opblock.opblock-patch {
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.BACKGROUND_COLOR};
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.BORDER_COLOR};
      }

      .swagger-ui .opblock.opblock-patch .opblock-summary-method {
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.SUMMARY_COLOR};
      }

      .swagger-ui .opblock.opblock-put {
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.BACKGROUND_COLOR};
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.BORDER_COLOR};
      }

      .swagger-ui .opblock.opblock-put .opblock-summary-method {
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.SUMMARY_COLOR};
      }

      .swagger-ui .btn.authorize {
        border-color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR};
        color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR};
      }

      .swagger-ui .btn.authorize svg {
        fill: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR};
      }
    `;
  }
}