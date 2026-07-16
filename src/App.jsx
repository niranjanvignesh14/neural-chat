import { useEffect, useState, useRef } from 'react';

const starterMessages = [
  {
    role: 'assistant',
    content: 'Welcome. I am Neural Chat Pro, your refined AI companion for thoughtful conversations, polished writing, and intelligent support.'
  }
];

const suggestions = [
  'Summarize this article in a polished way',
  'Help me write a professional email',
  'Explain AI in a simple, elegant way'
];

/**
 * Main Chat Application Component
 * Provides a professional chat interface with message history,
 * real-time responses, and accessibility features
 */
function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) throw new Error('Failed to load history');
        const data = await response.json();
        if (data.messages?.length) {
          setMessages(data.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt || new Date().toISOString()
          })));
        }
      } catch (err) {
        console.warn('History load failed:', err.message);
      }
    }

    loadHistory();
  }, []);

  /**
   * Formats timestamp for display
   */
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  /**
   * Copies message text to clipboard
   */
  const copyToClipboard = (content, id) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      setError('Failed to copy message');
    });
  };

  /**
   * Clears all messages and starts fresh
   */
  const clearChat = () => {
    if (window.confirm('Clear all messages? This cannot be undone.')) {
      setMessages(starterMessages);
      setError(null);
    }
  };

  /**
   * Handles message submission with keyboard support
   */
  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const timestamp = new Date().toISOString();
    const nextMessages = [...messages, { role: 'user', content: trimmed, timestamp }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'I could not generate a response at the moment.';
      const assistantTimestamp = new Date().toISOString();
      setMessages([...nextMessages, { role: 'assistant', content: reply, timestamp: assistantTimestamp }]);
    } catch (err) {
      setError('Connection error. Please check your network and try again.');
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'The assistant is currently unavailable. Please try again in a moment.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handles keyboard shortcuts
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="app-shell">
      <div className="panel">
        <aside className="sidebar">
          <div className="brand-block">
            <p className="eyebrow">AI Assistant</p>
            <h1>Neural Chat Pro</h1>
            <p className="subtitle">A refined conversational experience designed for clarity, premium presentation, and modern AI workflows.</p>
          </div>

          <div className="card">
            <h2>Try a prompt</h2>
            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  aria-label={`Use suggestion: ${suggestion}`}
                  title={suggestion}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <button
              onClick={clearChat}
              className="clear-btn"
              aria-label="Clear chat history"
              title="Clear all messages (Ctrl+L)"
              disabled={messages.length <= 1}
            >
              ✕ Clear Chat
            </button>
          </div>
        </aside>

        <section className="chat-area">
          <header className="chat-header">
            <div>
              <p className="eyebrow">Live workspace</p>
              <h2>Elegant assistant experience</h2>
            </div>
            <span className="status-pill" aria-live="polite">
              {isLoading ? '⏳ Thinking...' : '● Online'}
            </span>
          </header>

          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div className="messages" role="log" aria-label="Chat messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`bubble ${message.role}`}
                role="article"
              >
                <div className="bubble-content">
                  {message.content}
                </div>
                <div className="bubble-footer">
                  <span className="timestamp">{formatTime(message.timestamp)}</span>
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
                    className="copy-btn"
                    aria-label="Copy message"
                    title="Copy to clipboard"
                  >
                    {copiedId === index ? '✓ Copied' : '📋'}
                  </button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="bubble assistant loading" role="status">
                <div className="pulse">Thinking thoughtfully...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything with confidence... (Enter to send, Shift+Enter for new line)"
              aria-label="Message input"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              title="Send message (Enter)"
            >
              {isLoading ? '⏳' : '→'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
