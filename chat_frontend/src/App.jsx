import { useState } from "react";
import Auth from "./components/Auth";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [token, setToken] = useState(localStorage.getItem("chat_token") || null);
  const [username, setUsername] = useState(localStorage.getItem("chat_username") || null);

  const handleLoginSuccess = (newToken, loggedInUser) => {
    localStorage.setItem("chat_token", newToken);
    localStorage.setItem("chat_username", loggedInUser);
    
    setToken(newToken);
    setUsername(loggedInUser);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!token ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatRoom token={token} username={username} />
      )}
    </div>
  );
}

export default App;