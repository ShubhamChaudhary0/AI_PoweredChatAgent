import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'What are your features?',
  'What is the pricing?',
  'How do I connect Gemini API?',
  'Give me a python example'
];

const initialMessages = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hello! I am your AI assistant powered by Gemini. Ask me anything or choose a quick suggestion below!',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'chat'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, viewMode]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { id: Date.now(), sender: 'user', text: query.trim(), time: currentTime };
    
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || 'No response received.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const fallback = {
        id: Date.now() + 2,
        sender: 'bot',
        text: 'Sorry, the chatbot service is currently unreachable. Please check your connection.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Chat cleared. How can I help you next?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="app-shell">
      {viewMode === 'landing' ? (
        <div className="landing-card">
          <div className="landing-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span>Next-Gen AI Companion</span>
            </div>

            <h1 className="hero-title">
              Your AI agent is here
            </h1>

            <p className="hero-description">
              Experience intelligent conversations, quick code generation, problem-solving, and instant answers powered by <strong>Gemini 3.6 AI</strong>.
            </p>

            <div className="hero-action">
              <button 
                onClick={() => setViewMode('chat')} 
                className="cta-button-animated"
                aria-label="Let's ask your question"
              >
                <span className="cta-glow"></span>
                <span className="cta-text">Let's ask your question!</span>
                <svg className="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div>
                  <h3>Instant AI Replies</h3>
                  <p>Real-time intelligent answers</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💻</div>
                <div>
                  <h3>Code & Math Solver</h3>
                  <p>Debugging & complex math</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div>
                  <h3>Smart Suggestions</h3>
                  <p>Quick start conversation prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-card">
          {/* Header */}
          <header className="chat-header">
            <div className="header-brand">
              <button 
                onClick={() => setViewMode('landing')} 
                className="icon-btn back-btn" 
                title="Go to Home Landing Page"
                aria-label="Go to landing page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5"></path>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>

              <div className="avatar-bot header-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                  <path d="M12 12L2.5 4.5"></path>
                  <path d="M12 12v10"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div>
                <div className="header-title-row">
                  <h1>AI Assistant</h1>
                  <span className="status-badge">
                    <span className="status-dot"></span> Online
                  </span>
                </div>
                <p>Powered by Gemini 3.6 & Server API</p>
              </div>
            </div>

            <button onClick={clearChat} className="icon-btn" title="Clear Chat" aria-label="Clear chat history">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </header>

          {/* Messages */}
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-row ${message.sender}`}>
                {message.sender === 'bot' && (
                  <div className="avatar avatar-bot">⚡</div>
                )}

                <div className={`message-bubble ${message.sender}`}>
                  <div className="message-content">{message.text}</div>
                  <div className="message-meta">
                    <span className="time">{message.time}</span>
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(message.text, message.id)}
                      title="Copy text"
                    >
                      {copiedId === message.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="avatar avatar-user">You</div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="message-row bot">
                <div className="avatar avatar-bot">⚡</div>
                <div className="message-bubble bot loading-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {messages.length < 5 && (
            <div className="suggestions-container">
              <span className="suggestions-label">Suggested:</span>
              <div className="suggestions-scroll">
                {SUGGESTIONS.map((chip, idx) => (
                  <button
                    key={idx}
                    className="chip-btn"
                    onClick={() => handleSend(chip)}
                    disabled={isLoading}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <form onSubmit={handleSubmit} className="composer">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (Press Enter to send)"
                rows="1"
              />
            </div>
            <button type="submit" className="send-btn" disabled={!input.trim() || isLoading} aria-label="Send message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;


