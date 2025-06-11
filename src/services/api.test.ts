import { describe, expect, it, vi } from 'vitest';
import { consumeStream } from './api';

describe('consumeStream', () => {
  it('should throw an error if reader is not available', async () => {
    const mockResponse = {
      body: null,
    } as Response;

    const onTokenCb = vi.fn();

    await expect(consumeStream(mockResponse, onTokenCb)).rejects.toThrow(
      'Could not access reader',
    );
    expect(onTokenCb).not.toHaveBeenCalled();
  });

  it('should read from the stream and call onToken for each token', async () => {
    const mockTextEncoder = new TextEncoder();

    const mockReader = {
      read: vi.fn(),
    };

    const mockResponse = {
      body: {
        getReader: () => mockReader,
      },
    } as unknown as Response;

    const tokens = ['Hello', ' ', 'world', '!'];

    const mockJsonResponses = tokens.map((token) =>
      JSON.stringify({ response: token, done: false }),
    );
    // Add a final response to indicate the end of the stream
    mockJsonResponses.push(JSON.stringify({ done: true }));

    let index = 0;

    mockReader.read.mockImplementation(() => {
      if (index < tokens.length) {
        return Promise.resolve({
          done: false,
          value: mockTextEncoder.encode(mockJsonResponses[index++]),
        });
      }
      return Promise.resolve({ done: true });
    });

    const onTokenCb = vi.fn();

    await consumeStream(mockResponse, onTokenCb);

    expect(onTokenCb).toHaveBeenCalledTimes(tokens.length);
    expect(onTokenCb).toHaveBeenNthCalledWith(1, 'Hello');
    expect(onTokenCb).toHaveBeenNthCalledWith(2, ' ');
    expect(onTokenCb).toHaveBeenNthCalledWith(3, 'world');
    expect(onTokenCb).toHaveBeenNthCalledWith(4, '!');
  });
});
