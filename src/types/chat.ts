export type Message = {
  role: 'assistant' | 'user';
  content: string;
};

export type OllamMessage = Pick<Message, 'content'> & {
  role: 'assistant' | 'user' | 'system' | 'tool';
};

export type ChatRequestPayload = {
  messages: OllamMessage[];
  model: string;
};

export type ChatResponsePayload = {
  model: string;
  message: {
    role: 'assistant' | 'user';
    content: string;
  };
  done: boolean;
};
