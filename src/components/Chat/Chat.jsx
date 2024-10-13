import React, { useState, useRef, useEffect  } from 'react';
import css from './Chat.module.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isHeader, setIsHeader] = useState(true);

  const textareaRef = useRef(null);
  const chatBoxRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const newMessage = { text: input, user: 'user' };
    setMessages([newMessage, ...messages]);
    setIsHeader(false);

    const response = await fetch('https://ai-assistant-backend-05fx.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    
    const data = await response.json();
    
    const aiMessage = { text: data.message, user: 'ai' };
    setMessages([aiMessage, newMessage, ...messages]);
    setInput('');
  };

  const handleKeyDown = e => {
    const isMobile = window.innerWidth <= 768; 
  
    if (e.key === 'Enter') {
      if (isMobile) {
        return;
      }
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit(e); 
      }
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';  
    textarea.style.height = `${textarea.scrollHeight}px`;  
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className={css.container}>
      {isHeader && 
        <h1>
          How can I be useful to you?
        </h1>
      }
      <div
        ref={chatBoxRef}
        className={css.chatBox}
      >
        {messages.slice().reverse().map((msg, index) => (
          <div
            key={index}
            className={`${css.message} ${msg.user === 'user' && css.user}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className={css.form}
      >
        <textarea
          ref={textareaRef}
          type="text"
          value={input}
          placeholder="Write a message"
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={css.textarea}
        />
        <button
          type="submit"
          className={css.button}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
