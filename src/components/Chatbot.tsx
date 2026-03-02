'use client';
import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am the SchemeFinder AI assistant. How can I help you discover and understand government schemes today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages.slice(-5) }) // Send recent context
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: 'I encountered an error connecting to the AI services. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="chatbot-widget">
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          💬
          <span className="chat-badge">AI</span>
        </button>
      </div>
    );
  }

  return (
    <div className="chatbot-widget">
      <div className="chatbot-window">
        <div className="chat-header" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', gap: '4px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
            <h3><span style={{fontSize: '1.2rem'}}>✨</span> Navira AI Assistant</h3>
            <button style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}} onClick={() => setIsOpen(false)}>×</button>
          </div>
          <span style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px'}}>
            <span style={{fontSize: '0.9rem'}}>🔒</span> No chat data is saved
          </span>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className={`chat-message ai`}>
              <div className="dot-flashing"><span></span><span></span><span></span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about schemes..."
            disabled={loading}
          />
          <button type="submit" className="chat-send" disabled={loading || !input.trim()}>
            {loading ? '...' : '↑'}
          </button>
        </form>
      </div>
    </div>
  );
}
