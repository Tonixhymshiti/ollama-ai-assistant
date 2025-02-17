type Props = { chat: { message: string; isUser: boolean }[], isResLoading: boolean };

export const ChatBox = ({ chat, isResLoading }: Props) => {
  const msgList = chat?.map((item, i) => {
    return (
      <ChatBubble
        key={i}
        msg={item.message}
        role={item.isUser ? 'user' : 'assistant'}
      />
    );
  });

  const displayLoading = chat.length > 0 && chat[chat.length - 1].isUser && isResLoading;

  return (
    <div className="chat-box">
      {msgList}
      {displayLoading && <LoadingBubble/>}
      {msgList.length === 0 && (
        <div className="no-msg-txt">No messages yet</div>
      )}
    </div>
  );
};

export const ChatBubble = ({
  msg,
  role,
  className
}: {
  msg: string;
  role: 'assistant' | 'user';
  className?: string;
}) => {
  return (
    <div className={`chat-bubble chat-bubble--${role} chat-bubble--${className}`}>
      <div className="message">
        <p>{msg}</p>
      </div>
    </div>
  );
};

export const LoadingBubble = () => {
  return (
    <ChatBubble msg="..." role='assistant' className="loading"/>
  );
}
