import { ChatInput } from './ChatInput';
import { ChatBox } from './ChatBox';
import { Message } from '../types/chat';
import { ModelSelection } from './ModelSelection';

type Props = {
  chat: Message[];
  onSubmit: (prompt: string) => void;
  isResLoading: boolean;
  models: string[];
  selectedModel: string;
  onSelectModel?: (model: string) => void;
};

export const ChatView = ({
  chat,
  onSubmit,
  isResLoading,
  models,
  selectedModel,
  onSelectModel = () => {},
}: Props) => {
  return (
    <div className="chat">
      <div className="chat-wrapper">
        <div className="header">
          <h2>Chat Assistant</h2>
          <ModelSelection
            models={models}
            onSelect={onSelectModel}
            selectedModel={selectedModel}
          />
        </div>
        <ChatBox chat={chat} isResLoading={isResLoading} />
        <ChatInput onSubmit={onSubmit} disabled={!selectedModel} />
      </div>
    </div>
  );
};
