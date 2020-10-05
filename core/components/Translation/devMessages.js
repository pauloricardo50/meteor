import { useState, useEffect } from 'react';
import { messages, onMessageAdded } from './defineMessage';

export default function useDevMessages() {
  const [_messages, setMessages] = useState({});

  useEffect(() => {
    const removeListener = onMessageAdded(() => {
      setMessages(messages);
    });

    return removeListener;
  }, []);

  return _messages;
}
