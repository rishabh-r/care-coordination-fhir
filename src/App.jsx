import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ChatWidget from './components/ChatWidget';
import Patient360Page from './components/patient360/Patient360Page';
import { formatDisplayName } from './utils/formatters';
import useChat from './hooks/useChat';

function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  // Initialize auth synchronously from localStorage — prevents redirect flash on new tab
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!(localStorage.getItem("cb_token") && localStorage.getItem("cb_user"));
  });
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem("cb_user");
    return saved ? formatDisplayName(saved) : '';
  });
  const [userInitial, setUserInitial] = useState(() => {
    const saved = localStorage.getItem("cb_user");
    if (saved) {
      const name = formatDisplayName(saved);
      return name.charAt(0).toUpperCase();
    }
    return 'U';
  });
  const navigate = useNavigate();

  const {
    messages,
    isTyping,
    isBotResponding,
    rateLimitMessage,
    handleSend,
    handleChipSelect,
    clearChat,
    currentPatient,
  } = useChat();

  const handleLoginSuccess = (name) => {
    const displayName = formatDisplayName(name);
    setUserName(displayName);
    setUserInitial(displayName.charAt(0).toUpperCase());
    setLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem("cb_token");
    localStorage.removeItem("cb_user");
    clearChat();
    setLoggedIn(false);
    setUserName('');
    setUserInitial('U');
    navigate('/login');
  };

  const chatWidgetProps = {
    messages,
    isTyping,
    rateLimitMessage,
    isBotResponding,
    onSend: handleSend,
    onChipSelect: handleChipSelect,
    onClearChat: clearChat,
    userName,
    userInitial,
    currentPatient: currentPatient.current,
  };

  return (
    <Routes>
      <Route path="/login" element={
        loggedIn ? <Navigate to="/" replace /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/" element={
        <ProtectedRoute loggedIn={loggedIn}>
          <HomeScreen onLogout={handleLogout} />
          <ChatWidget {...chatWidgetProps} />
        </ProtectedRoute>
      } />
      <Route path="/patient/:id" element={
        <ProtectedRoute loggedIn={loggedIn}>
          <Patient360Page />
          <ChatWidget {...chatWidgetProps} />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
