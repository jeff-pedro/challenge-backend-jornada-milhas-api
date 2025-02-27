export interface AppConfig {
  port: number;
  accessKeys: {
    geminiApiKey: string | undefined;
  };
}
