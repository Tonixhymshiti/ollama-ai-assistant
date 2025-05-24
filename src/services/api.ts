import { OLLAMA_BASE_URL, LLM_MODEL } from './constants';

interface ModelsResponse {
  models: string[];
}

type PostGenerateParams = {
  prompt: string;
  model: string;
  context?: string;
};

class OllamaService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async getModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/models`);
    if (response.status > 300) {
      throw new Error(`Api error: ${response.status}`);
    }
    const data: ModelsResponse = await response.json();
    return data.models;
  }

  public async generateCompletion(
    parameters: PostGenerateParams,
    onToken: (token: string) => void,
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });
    if (response.status > 300) {
      throw new Error(`Api error: ${response.status}`);
    }
    return consumeStream(response, onToken);
  }
}

async function consumeStream(
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

export const ollamaService = new OllamaService(OLLAMA_BASE_URL);
