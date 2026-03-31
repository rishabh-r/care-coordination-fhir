import { useState } from 'react';
import ChatPanel from './ChatPanel';

export default function ChatWidget({
  messages,
  isTyping,
  rateLimitMessage,
  isBotResponding,
  onSend,
  onChipSelect,
  onClearChat,
  userName,
  userInitial,
  currentPatient,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const togglePanel = () => setPanelOpen(!panelOpen);
  const closePanel = () => setPanelOpen(false);

  return (
    <div id="chat-widget">
      <ChatPanel
        visible={panelOpen}
        onClose={closePanel}
        onClearChat={onClearChat}
        messages={messages}
        isTyping={isTyping}
        rateLimitMessage={rateLimitMessage}
        isBotResponding={isBotResponding}
        onSend={onSend}
        onChipSelect={onChipSelect}
        userName={userName}
        userInitial={userInitial}
        currentPatient={currentPatient}
      />

      {/* Floating Toggle Button */}
      <button className="chat-toggle-btn" title="Open CareBridge" onClick={togglePanel}>
        <img
          src="/chatbot_image/chatbot.png"
          alt="CareBridge"
          className={`toggle-icon-open${panelOpen ? ' hidden' : ''}`}
        />
        <svg
          className={`toggle-icon-close${panelOpen ? '' : ' hidden'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
