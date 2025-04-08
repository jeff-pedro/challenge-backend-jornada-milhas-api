export interface IAService {
  generateText(prompt: string, file?: unknown): Promise<string | null>;
}
