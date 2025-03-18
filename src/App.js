/** @format */

import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { run } from './sentient/sentientResponse';

function App() {
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I am your Sentient Analysis Agent, Please type your sentense to help me understand if its Positive Negative or Neutral?',
      user: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setMessages((prev) => [...prev, { text: userMessage, user: 'human' }]);
      setIsLoading(true);
      try {
        const response = await run(input.trim());
        setMessages((prev) => [...prev, { text: response, user: 'ai' }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          { text: 'An error occurred. Please try again.', user: 'ai' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='App'>
      <div className='chat-container'>
        <div className='chat-header'>
          <h2>Sentient Analysis</h2>
        </div>
        <div className='chat-messages'>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.user}`}>
              <div>
                {message.user === 'ai' ? '🤖 ' : '👱🏼'}
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='message ai'>
              <div>🤖 Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='chat-input-form'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message here...'
            className='chat-input'
            disabled={isLoading}
          />
          <button
            type='submit'
            className='chat-submit'
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
