interface ModelsResponse {
  models: string[];
}

type PostGenerateParams = {
  prompt: string;
  context?: string;
};

class OllamaService {
  // Use private for encapsulation
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  // Public method to get models
  public async getModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/models`);
    if (response.status > 300) {
      throw new Error(`Api error: ${response.status}`);
    }
    const data: ModelsResponse = await response.json();
    return data.models;
  }

  public setModel(model: string): void {
    this.model = model;
  }

  public getModel(): string {
    return this.model;
  }

  public async postGenerateCompletion(
    parameters: PostGenerateParams,
    onToken: (token: string) => void,
  ): Promise<void> {
    if (!this.model) {
      throw new Error('Model not set');
    }
    const payload = { ...parameters, model: this.model };
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.status > 300) {
      throw new Error(`Api error: ${response.status}`);
    }
    return this.consumeStream(response, onToken);
  }

  private async consumeStream(
    response: Response,
    onToken: (token: string) => void,
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Could not access reader');
    }
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedValue = new TextDecoder().decode(value);
      try {
        const parsed = JSON.parse(decodedValue);
        onToken(parsed.response);
      } catch (e) {
        throw new Error('Failed to parse response chunk');
      }
    }
  }
}

const OLLAMA_BASE_URL = 'http://localhost:11434';
const LLM_MODEL = (import.meta.env.VITE_LLM_MODEL as string) || 'llama3.2:1b';

export default new OllamaService(OLLAMA_BASE_URL, LLM_MODEL);
