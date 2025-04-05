export interface AppConfig {
  port: number;
  ia: {
    apiKey: string | undefined
    model: string
  }
}
