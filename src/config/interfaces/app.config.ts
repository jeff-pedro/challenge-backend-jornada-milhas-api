export interface AppConfig {
  port: number;
  ai: {
    apiKey: string | undefined
    model: string
  }
}
