import { useEffect, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';

export const ChatInput = ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) => {
  const [input, setInput] = useState('');

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onPromptSubmit = useCallback(() => {
    if (!input) {
      return;
    }
    onSubmit(input);
    setInput('');
  }, [input, onSubmit]);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onPromptSubmit();
      }
    };
    window.addEventListener('keyup', eventHandler);

    return () => window.removeEventListener('keyup', eventHandler);
  }, [input, onPromptSubmit]);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', eventHandler);

    return () => window.removeEventListener('keydown', eventHandler);
  }, [input]);

  return (
    <div className="input-box">
      <textarea
        onChange={onInputChange}
        value={input}
        placeholder="Type your message here..."
      ></textarea>
    </div>
  );
};
