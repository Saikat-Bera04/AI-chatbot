import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, ArrowUpRight, ArrowDownLeft, ArrowUpLeft, ArrowDownRight, AlertCircle } from 'lucide-react';
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
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showApiInput, setShowApiInput] = useState(!import.meta.env.VITE_GEMINI_API_KEY);
  const [apiError, setApiError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Debug: Log the API key status
    console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
    console.log('API Key length:', apiKey?.length || 0);
    console.log('Show API Input:', showApiInput);
  }, [apiKey, showApiInput]);

  const validateApiKey = (key) => {
    // Basic validation for Gemini API key format
    return key && key.length > 30 && key.startsWith('AIza');
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!apiKey.trim()) {
      setApiError('Please enter an API key');
      return;
    }
    
    if (!validateApiKey(apiKey)) {
      setApiError('Invalid API key format. Please check your Gemini API key.');
      return;
    }
    
    setShowApiInput(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending request with API key:', apiKey.substring(0, 10) + '...');
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: userMessage.content }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('API Response:', response.data);

      if (response.data.candidates && response.data.candidates[0]) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Sorry, I encountered an error. ';
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.error?.message) {
          errorMessage += `API Error: ${errorData.error.message}`;
        } else {
          errorMessage += 'Invalid API key or request format. Please check your API key.';
        }
        setShowApiInput(true);
      } else if (error.response?.status === 403) {
        errorMessage += 'API key access denied. Please verify your API key has the correct permissions.';
        setShowApiInput(true);
      } else if (error.response?.status === 429) {
        errorMessage += 'Rate limit exceeded. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage += 'Network connection error. Please check your internet connection.';
      } else {
        errorMessage += `Unexpected error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApiKey = () => {
    setApiKey('');
    setApiError('');
    setShowApiInput(true);
    setMessages([]);
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
            
            {apiError && (
              <div className="api-error">
                <AlertCircle size={16} />
                <span>{apiError}</span>
              </div>
            )}
            
            <form onSubmit={handleApiKeySubmit} className="api-form">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key (starts with AIza...)"
                className="api-input"
                required
              />
              <button type="submit" className="api-submit">
                <Sparkles size={16} />
                Start Chatting
              </button>
            </form>
            <div className="api-help">
              <p>
                Get your free API key from{' '}
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Google AI Studio
                </a>
              </p>
              <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                <strong>Steps to get your API key:</strong><br/>
                1. Visit Google AI Studio<br/>
                2. Sign in with your Google account<br/>
                3. Click "Get API key"<br/>
                4. Create a new API key<br/>
                5. Copy and paste it here
              </p>
            </div>
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
        <div className="corner-arrow top-right" onClick={resetApiKey} style={{ cursor: 'pointer' }}>
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