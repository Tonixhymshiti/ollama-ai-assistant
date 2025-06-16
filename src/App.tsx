import React, { useState } from 'react';
import './index.css';
import { ChatView } from './components/Chat';
import { ollamaService } from './services/api';
import { Message } from './types/chat';
import { isUserMessage } from './utils/util';

const App: React.FC = () => {
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState<string>('');

  React.useEffect(() => {
    ollamaService
      .getModels()
      .then((res) => res.models)
      .then((models) => {
        setModels(models.map((model) => model.name));
      })
      .catch((error: unknown) => {
        console.error('Error fetching models:', error);
      });
  }, []);

  const sendPrompt = (prompt: string) => {
    if (!prompt || prompt.trim() === '' || model === '') {
      console.warn('Prompt is empty or model is not selected');
      return;
    }

    setChat((prevChat) => [
      ...prevChat,
      { content: prompt, role: 'user' },
      { content: '', role: 'assistant' },
    ]);
    setIsLoading(true);

    const onToken = (token: string) => {
      setChat((prevChat) => {
        let updatedChat = structuredClone(prevChat);
        const lastMessageIndex = updatedChat.length - 1;

        if (
          lastMessageIndex >= 0 &&
          !isUserMessage(updatedChat[lastMessageIndex])
        ) {
          updatedChat[lastMessageIndex].content += token;
        }
        return updatedChat;
      });
    };

    // Exclude the last item if it's a placeholder (assistant, empty message)
    const chatForBackend =
      chat.length > 0 &&
      !isUserMessage(chat[chat.length - 1]) &&
      chat[chat.length - 1].content === ''
        ? chat.slice(0, -1)
        : chat;
    const messages = [
      ...chatForBackend,
      { role: 'user' as const, content: prompt },
    ];

    ollamaService
      .chat({ model, messages }, onToken)
      .then(() => setIsLoading(false))
      .catch((error: unknown) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <div className="container">
        {/* <ChatHistory/> */}
        <ChatView
          chat={chat}
          onSubmit={sendPrompt}
          isResLoading={loading}
          models={models}
          onSelectModel={(selectedModel) => {
            setModel(selectedModel);
          }}
          selectedModel={model}
        />
      </div>
    </div>
  );
};

export default App;
