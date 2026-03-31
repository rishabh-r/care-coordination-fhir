export default function TypingIndicator({ visible, rateLimitMessage }) {
  if (!visible) return null;

  return (
    <div className="typing-indicator">
      <img src="/chatbot_image/chatbot.png" alt="" className="typing-avatar" />
      <div className="typing-bubble">
        {rateLimitMessage ? (
          <span style={{ fontSize: '11px', color: '#4a5568' }}>{rateLimitMessage}</span>
        ) : (
          <>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </>
        )}
      </div>
    </div>
  );
}
