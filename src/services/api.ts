import { OLLAMA_BASE_URL } from '../constants/constants';
import { ChatRequestPayload, ChatResponsePayload } from '../types/chat';
import { ListModelsResponse } from '../types/model';

export class OllamaService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async getModels(): Promise<ListModelsResponse> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    if (response.status > 300) {
      throw new Error(`Api error: ${response.status}`);
    }
    const data: ListModelsResponse = await response.json();
    return data;
  }

  public async chat(
    parameters: ChatRequestPayload,
    onToken: (token: string) => void,
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });
    if (response.status > 300) {
      throw new Error(`Api error: ${response.status}`);
    }
    return this.consumeStream(response, onToken);
  }

  private async consumeStream(
    response: Response,
    onToken: (message: string) => void,
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
        const parsed = JSON.parse(decodedValue) as ChatResponsePayload;
        onToken(parsed.message.content);
      } catch (e) {
        throw new Error('Failed to parse response chunk');
      }
    }
  }
}

export const ollamaService = new OllamaService(OLLAMA_BASE_URL);
