import { useState } from 'react';

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

function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      const data = await response.json();
      const reply = data.reply || 'I am sorry, I could not generate a response at the moment.';
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([...nextMessages, { role: 'assistant', content: 'The assistant is currently unavailable. Please try again in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  }

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
                <button key={suggestion} onClick={() => setInput(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="chat-area">
          <header className="chat-header">
            <div>
              <p className="eyebrow">Live workspace</p>
              <h2>Elegant assistant experience</h2>
            </div>
            <span className="status-pill">Online</span>
          </header>

          <div className="messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                {message.content}
              </div>
            ))}
            {isLoading && <div className="bubble assistant loading">Thinking thoughtfully...</div>}
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything with confidence..."
              aria-label="Message input"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending…' : 'Send'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
