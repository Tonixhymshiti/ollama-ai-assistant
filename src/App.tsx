import React, { useState } from 'react';
import './index.css';
import { ChatView } from './components/Chat';
import { postGenerateCompletion } from './services/api';

const LLM_MODEL: string =
  (import.meta.env.VITE_LLM_MODEL as string) || 'llama3.2:1b';

const App: React.FC = () => {
  const [chat, setChat] = useState<{ message: string; isUser: boolean }[]>([]);
  const [loading, setIsLoading] = useState(false);

  const updateState = (message: string, isUser = true) => {
    setChat((chat) => [...chat, { message, isUser }]);
  };

  const sendPrompt = (prompt: string) => {
    updateState(prompt);
    setIsLoading(true)
    postGenerateCompletion({ prompt, model: LLM_MODEL }).then((res) => {
      updateState(res, false),
      setIsLoading(false);
    }
    );
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
