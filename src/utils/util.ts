import { Message } from '../types/chat';

export const isUserMessage = (message: Message) => {
  return message.role === 'user';
};
