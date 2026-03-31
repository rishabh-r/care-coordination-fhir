import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ChatWidget from './components/ChatWidget';
import { formatDisplayName } from './utils/formatters';
import useChat from './hooks/useChat';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('U');

  const {
    messages,
    isTyping,
    isBotResponding,
    rateLimitMessage,
    handleSend,
    handleChipSelect,
    clearChat,
  } = useChat();

  // Auto-login check on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("cb_token");
    const savedUser  = localStorage.getItem("cb_user");
    if (savedToken && savedUser) {
      const displayName = formatDisplayName(savedUser);
      setUserName(displayName);
      setUserInitial(displayName.charAt(0).toUpperCase());
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (name) => {
    const displayName = formatDisplayName(name);
    setUserName(displayName);
    setUserInitial(displayName.charAt(0).toUpperCase());
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("cb_token");
    localStorage.removeItem("cb_user");
    clearChat();
    setLoggedIn(false);
    setUserName('');
    setUserInitial('U');
  };

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <HomeScreen onLogout={handleLogout} />
      <ChatWidget
        messages={messages}
        isTyping={isTyping}
        rateLimitMessage={rateLimitMessage}
        isBotResponding={isBotResponding}
        onSend={handleSend}
        onChipSelect={handleChipSelect}
        onClearChat={clearChat}
        userName={userName}
        userInitial={userInitial}
      />
    </>
  );
}
