type Props = { chat: { message: string; isUser: boolean }[] };

export const ChatBox = ({ chat }: Props) => {
  const msgList = chat?.map((item, i) => {
    return (
      <ChatBubble
        key={i}
        msg={item.message}
        role={item.isUser ? 'user' : 'assistant'}
      />
    );
  });

  return (
    <div className="chat-box">
      {msgList}
      {msgList.length === 0 && (
        <div className="no-msg-txt">No messages yet</div>
      )}
    </div>
  );
};

export const ChatBubble = ({
  msg,
  role,
}: {
  msg: string;
  role: 'assistant' | 'user';
}) => {
  return (
    <div className={`chat-bubble chat-bubble--${role}`}>
      <div className="message">
        <p>{msg}</p>
      </div>
    </div>
  );
};
