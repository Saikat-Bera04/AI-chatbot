import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, ArrowUpRight, ArrowDownLeft, ArrowUpLeft, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import './App.css';

const TypewriterText = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [text, speed]);

  return (
    <span>
      {displayText}
      <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>
    </span>
  );
};

const FloatingDot = ({ delay, color, size, duration }) => (
  <div 
    className="floating-dot"
    style={{
      '--delay': `${delay}s`,
      '--color': color,
      '--size': `${size}px`,
      '--duration': `${duration}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }}
  />
);

const LoadingDots = () => (
  <div className="loading-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setShowApiInput(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: input }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API key and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showApiInput) {
    return (
      <div className="app">
        <div className="background"></div>
        <div className="glass-card api-setup">
          <div className="corner-arrow top-left">
            <ArrowUpLeft size={20} />
          </div>
          <div className="corner-arrow top-right">
            <ArrowUpRight size={20} />
          </div>
          <div className="corner-arrow bottom-left">
            <ArrowDownLeft size={20} />
          </div>
          <div className="corner-arrow bottom-right">
            <ArrowDownRight size={20} />
          </div>
          
          {Array.from({ length: 25 }, (_, i) => (
            <FloatingDot
              key={i}
              delay={Math.random() * 5}
              color={['#00ff88', '#0088ff', '#ff0088', '#88ff00', '#ff8800'][Math.floor(Math.random() * 5)]}
              size={Math.random() * 8 + 4}
              duration={Math.random() * 10 + 10}
            />
          ))}

          <div className="setup-content">
            <Sparkles className="setup-icon" size={48} />
            <h2>Welcome to EVO AI</h2>
            <p>Enter your Gemini API key to get started</p>
            <form onSubmit={handleApiKeySubmit} className="api-form">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="api-input"
                required
              />
              <button type="submit" className="api-submit">
                <Sparkles size={16} />
                Start Chatting
              </button>
            </form>
            <p className="api-help">
              Get your free API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="background"></div>
      <div className="glass-card">
        <div className="corner-arrow top-left">
          <ArrowUpLeft size={20} />
        </div>
        <div className="corner-arrow top-right">
          <ArrowUpRight size={20} />
        </div>
        <div className="corner-arrow bottom-left">
          <ArrowDownLeft size={20} />
        </div>
        <div className="corner-arrow bottom-right">
          <ArrowDownRight size={20} />
        </div>
        
        {Array.from({ length: 25 }, (_, i) => (
          <FloatingDot
            key={i}
            delay={Math.random() * 5}
            color={['#00ff88', '#0088ff', '#ff0088', '#88ff00', '#ff8800'][Math.floor(Math.random() * 5)]}
            size={Math.random() * 8 + 4}
            duration={Math.random() * 10 + 10}
          />
        ))}

        <div className="chat-header">
          <h1 className="title">
            <Sparkles className="title-icon" />
            EVO AI
          </h1>
          <div className="typewriter">
            <TypewriterText text="ask anything you like" speed={80} />
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-input-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="write here"
              className="chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading || !input.trim()}
            >
              <Sparkles size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;