import React, { useState } from 'react';
import './index.css';
import { ChatView } from './components/Chat';
import { postGenerateCompletion } from './services/api';

const LLM_MODEL: string =
  (import.meta.env.VITE_LLM_MODEL as string) || 'llama3.2:1b';

const App: React.FC = () => {
  const [chat, setChat] = useState<{ message: string; isUser: boolean }[]>([]);

  const updateState = (message: string, isUser = true) => {
    setChat((chat) => [...chat, { message, isUser }]);
  };

  const sendPrompt = (prompt: string) => {
    updateState(prompt);
    postGenerateCompletion({ prompt, model: LLM_MODEL }).then((res) =>
      updateState(res, false),
    );
  };

  return (
    <div className="App">
      <div className="container">
        {/* <ChatHistory/> */}
        <ChatView chat={chat} onSubmit={sendPrompt} />
      </div>
    </div>
  );
};

export default App;
