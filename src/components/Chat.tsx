import { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatBox } from './ChatBox';

type Props = {
  chat: { message: string; isUser: boolean }[];
  onSubmit: (prompt: string) => void;
  isResLoading: boolean;
};

export const ChatView = ({ chat, onSubmit, isResLoading }: Props) => {
  return (
    <div className="chat">
      <div className="chat-wrapper">
        <div className="header">
          <h2>Assistant powered by Ollama</h2>
        </div>
        <ChatBox chat={chat} isResLoading={isResLoading} />
        <ChatInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};
