import React, { useState } from 'react';
import './index.css';
import { ChatView } from './components/Chat';
import { LLM_MODEL } from './constants/constants';
import { ollamaService } from './services/api';
import { Message } from './types/chat';
import { isUserMessage } from './utils/util';

const App: React.FC = () => {
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [model] = useState<string>(LLM_MODEL);

  const sendPrompt = (prompt: string) => {
    setChat((prevChat) => [
      ...prevChat,
      { content: prompt, role: "user" },
      { content: '', role: "assistant" }
    ]);
    setIsLoading(true);

    const onToken = (token: string) => {
      setChat((prevChat) => {
        let updatedChat = structuredClone(prevChat);
        const lastMessageIndex = updatedChat.length - 1;
        console.log('lastMessageIndex', lastMessageIndex);

        if (lastMessageIndex >= 0 && !isUserMessage(updatedChat[lastMessageIndex])) {
          updatedChat[lastMessageIndex].content += token;
        }
        return updatedChat;
      });
    };

    // Exclude the last item if it's a placeholder (assistant, empty message)
    const chatForBackend =
      chat.length > 0 && !isUserMessage(chat[chat.length - 1]) && chat[chat.length - 1].content === ''
        ? chat.slice(0, -1)
        : chat;
    const messages = [
      ...chatForBackend,
      { role: 'user' as const, content: prompt }
    ];

    ollamaService.chat({ model, messages }, onToken)
      .then(() => setIsLoading(false))
      .catch((error: unknown) => {
        console.error('Error:', error);
        setIsLoading(false);
        // updateState('Error: could not generate response', false);
      });
  };

  return (
    <div className="App">
      <div className="container">
        {/* <ChatHistory/> */}
        <ChatView chat={chat} onSubmit={sendPrompt} isResLoading={loading}/>
      </div>
    </div>
  );
};

export default App;
