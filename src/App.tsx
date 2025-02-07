import React, { useState } from 'react';
import './index.css';
import { ChatView } from './components/ChatView';
import { postGenerateCompletion } from './services/api';

const model = "llama3.2:1b";

const App: React.FC = () => {
    const [chat, setChat] = useState<{ prompt: string, res: string }[]>([]);

    const updateState = (prompt: string, res: string) => {
        setChat([...chat, {prompt,res}])
    }

    const sendPrompt = (prompt: string) => {
        updateState(prompt, "");
        postGenerateCompletion({ prompt, model }).then(res => updateState(prompt, res))
    }

    return (
        <div className="App">
            <div className="container">
                {/* <ChatHistory/> */}
                <ChatView chat={chat} onSubmit={sendPrompt}/>
            </div>
        </div>
    );
};

export default App;