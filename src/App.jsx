import { useState, useEffect } from 'react';
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('U');
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
