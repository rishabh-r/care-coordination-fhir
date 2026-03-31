import { useState, useRef, useEffect } from 'react';
import PredefinedDropdown from './PredefinedDropdown';

export default function ChatInputBar({ onSend, onChipSelect, isBotResponding }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const canSend = !isBotResponding && text.trim() !== '';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!canSend) return;
    const msg = text.trim();
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    onSend(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  };

  return (
    <div className="chat-input-bar">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          id="user-input"
          placeholder="Ask about patient records, labs..."
          rows="1"
          maxLength="2000"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <PredefinedDropdown onSelect={onChipSelect} disabled={isBotResponding} />
        <button
          className="send-btn"
          disabled={!canSend}
          title="Send"
          onClick={handleSend}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <p className="input-hint">CareBridge retrieves FHIR R4 data. Never provides treatment recommendations.</p>
    </div>
  );
}
