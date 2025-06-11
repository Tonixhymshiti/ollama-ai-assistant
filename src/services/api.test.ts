import { describe, expect, it, vi, beforeEach } from 'vitest';
import { OllamaService } from './api';

const BASE_URL = 'http://localhost:11434';

// Patch fetch on the globalThis object for browser-like environments
(globalThis as any).fetch = vi.fn();

describe('OllamaService', () => {
  let service: OllamaService;

  beforeEach(() => {
    service = new OllamaService(BASE_URL);
    (globalThis.fetch as any).mockReset();
  });

  it('should throw an error if reader is not available', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      status: 200,
      body: null,
    });
    const onTokenCb = vi.fn();
    await expect(
      service.chat({ messages: [], model: 'test' }, onTokenCb),
    ).rejects.toThrow('Could not access reader');
    expect(onTokenCb).not.toHaveBeenCalled();
  });

  it('should read from the stream and call onToken for each token', async () => {
    const tokens = ['Hello', ' ', 'world', '!'];
    const mockJsonResponses = tokens.map((token) =>
      JSON.stringify({
        model: 'test',
        message: { role: 'assistant', content: token },
        done: false,
      }),
    );
    const readSequence = mockJsonResponses.map((json) => ({
      done: false,
      value: new TextEncoder().encode(json),
    }));
    // Add a final response to indicate the end of the stream (with empty value)
    readSequence.push({ done: true, value: new Uint8Array() });
    (globalThis.fetch as any).mockResolvedValue({
      status: 200,
      body: {
        getReader: () => {
          let index = 0;
          return {
            read: vi.fn(() => {
              if (index < readSequence.length) {
                return Promise.resolve(readSequence[index++]);
              }
              return Promise.resolve({ done: true, value: new Uint8Array() });
            }),
          };
        },
      },
    });
    const onTokenCb = vi.fn();
    await service.chat({ messages: [], model: 'test' }, onTokenCb);
    expect(onTokenCb).toHaveBeenCalledTimes(tokens.length);
    expect(onTokenCb).toHaveBeenNthCalledWith(1, 'Hello');
    expect(onTokenCb).toHaveBeenNthCalledWith(2, ' ');
    expect(onTokenCb).toHaveBeenNthCalledWith(3, 'world');
    expect(onTokenCb).toHaveBeenNthCalledWith(4, '!');
  });
});
