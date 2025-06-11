import React, { useState } from 'react';
import './index.css';
import { ChatView } from './components/Chat';
import { LLM_MODEL } from './services/constants';
import { ollamaService } from './services/api';

type ChatMessage = { message: string; isUser: boolean };

const App: React.FC = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [model] = useState<string>(LLM_MODEL);

  const updateState = (message: string, isUser = true) => {
    setChat((chat) => [...chat, { message, isUser }]);
  };

  const sendPrompt = (prompt: string) => {
    setChat((prevChat) => [
      ...prevChat,
      { message: prompt, isUser: true },
      { message: '', isUser: false }
    ]);
    setIsLoading(true);

    const onToken = (token: string) => {
      setChat((prevChat) => {
        let updatedChat = structuredClone(prevChat);
        const lastMessageIndex = updatedChat.length - 1;
        console.log('lastMessageIndex', lastMessageIndex);

        if (lastMessageIndex >= 0 && !updatedChat[lastMessageIndex].isUser) {
          updatedChat[lastMessageIndex].message += token;
        }
        return updatedChat;
      });
    };

    ollamaService.generateCompletion({ prompt, model }, onToken)
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
        updateState('Error: could not generate response', false);
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
