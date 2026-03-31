import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import WelcomeCard from './WelcomeCard';
import TypingIndicator from './TypingIndicator';
import ChatInputBar from './ChatInputBar';

export default function ChatPanel({
  visible,
  onClose,
  onClearChat,
  messages,
  isTyping,
  rateLimitMessage,
  isBotResponding,
  onSend,
  onChipSelect,
  userName,
  userInitial,
  currentPatient,
}) {
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!visible) return null;

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <div className="chat-panel-info">
          <img src="/chatbot_image/chatbot.png" alt="CareBridge" className="panel-avatar" />
          <div>
            <span className="panel-name">RSICareBridge</span>
            <span className="panel-status"><span className="online-dot"></span>Online</span>
          </div>
        </div>
        <div className="panel-header-actions">
          <button className="panel-action-btn" title="Clear chat" onClick={onClearChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>
          <button className="panel-action-btn" title="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="messages-area" ref={messagesRef}>
        {messages.length === 0 ? (
          <WelcomeCard name={userName} />
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              text={msg.text}
              userInitial={userInitial}
              isStreaming={msg.isStreaming}
              userMessage={msg.userMessage}
              currentPatient={currentPatient}
            />
          ))
        )}
      </div>

      <TypingIndicator visible={isTyping} rateLimitMessage={rateLimitMessage} />

      <ChatInputBar
        onSend={onSend}
        onChipSelect={onChipSelect}
        isBotResponding={isBotResponding}
      />
    </div>
  );
}
