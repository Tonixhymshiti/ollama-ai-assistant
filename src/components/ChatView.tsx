import { useState } from 'react';

type Props = {
  chat: { prompt: string; res: string }[];
  onSubmit: (prompt: string) => void;
};

export const ChatView = ({ chat, onSubmit }: Props) => {
  const [input, setInput] = useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onPromptSubmit = () => {
    setInput('');
    onSubmit(input);
  };

  const msgList = chat?.map((exchange, i) => {
    return (
      <>
        <ChatBubble key={i} msg={exchange.prompt} role="user" />
        <ChatBubble key={i} msg={exchange.res} role="assistant" />
      </>
    );
  });

  return (
    <div className="chat">
      <div className="chat-wrapper">
        <div className="header">
          <h2>Ollama</h2>
        </div>
        <div className="chat-box">
          {msgList}
          {msgList.length === 0 && (
            <div className="no-msg-txt">No messages yet</div>
          )}
        </div>
        <div className="input-box">
          <textarea
            onChange={onInputChange}
            value={input}
            placeholder="Type your message here..."
          ></textarea>
          <button onClick={onPromptSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export const ChatBubble = ({
  msg,
  role,
  key,
}: {
  msg: string;
  role: 'assistant' | 'user';
  key: number;
}) => {
  return (
    <div key={key} className={`chat-bubble chat-bubble--${role}`}>
      <div className="message">
        <p>{msg}</p>
      </div>
    </div>
  );
};
