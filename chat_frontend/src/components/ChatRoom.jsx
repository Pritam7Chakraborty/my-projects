import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import SettingsModal from "./SettingsModal";

const COLORS = {
  ink: "#12172B",
  panel: "#1B2340",
  card: "#232B4D",
  cardBorder: "#2E3760",
  brass: "#E8A33D",
  brassDim: "#B87F2A",
  sage: "#6FCF97",
  danger: "#E85D5D",
  text: "#F3F1EA",
  muted: "#8B93B8",
  mutedDim: "#5C6390",
};

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

@keyframes signalPulse {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
}
@keyframes bubbleIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes tickerIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.crt-bubble { animation: bubbleIn 0.25s ease-out; }
.crt-ticker { animation: tickerIn 0.4s ease-out; }
.crt-scroll::-webkit-scrollbar { width: 8px; }
.crt-scroll::-webkit-scrollbar-track { background: transparent; }
.crt-scroll::-webkit-scrollbar-thumb { background: ${COLORS.cardBorder}; border-radius: 8px; }
.crt-input:focus { box-shadow: 0 0 0 3px rgba(232,163,61,0.25); }
.crt-send:not(:disabled):hover { background: #F0B155 !important; }
.crt-row:hover { background: rgba(255,255,255,0.03); }
`;

const SignalBars = ({ connected }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 12 }}>
    {[4, 7, 10].map((h, i) => (
      <div
        key={i}
        style={{
          width: 3,
          height: h,
          borderRadius: 1,
          background: connected ? COLORS.sage : COLORS.danger,
          animation: connected ? `signalPulse 1.4s ease-in-out ${i * 0.15}s infinite` : "none",
          opacity: connected ? 1 : 0.4,
        }}
      />
    ))}
  </div>
);

const ChatRoom = ({ token, username }) => {
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- NEW STATES FOR UNREAD & TYPING ---
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchActiveUsers = useCallback(() => {
    fetch("/api/users/active")
      .then((res) => res.json())
      .then((data) => setActiveUsers(data))
      .catch((err) => console.error("Failed to fetch active users", err));
  }, []);

  const fetchChatHistory = useCallback(() => {
    const endpoint = selectedUser
      ? `/api/messages/private/${username}/${selectedUser.username}`
      : "/api/messages/public";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const chatHistory = data.filter((msg) => msg.type === "CHAT");
        setMessages(chatHistory);
        scrollToBottom();
      })
      .catch((err) => console.error("Failed to load history", err));
  }, [selectedUser, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Replaces the problematic useEffect. Handle state changes during the event instead.
  const handleUserSelect = (user) => {
    setSelectedUser(user);

    if (user) {
      setUnreadCounts((prev) => ({ ...prev, [user.username]: 0 }));

      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: "/app/chat.read",
          body: JSON.stringify({ reader: username, sender: user.username })
        });

        setMessages((prev) => prev.map(msg =>
          msg.sender === user.username ? { ...msg, read: true } : msg
        ));
      }
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [selectedUser, fetchChatHistory]);

  useEffect(() => {
    fetchActiveUsers();

    const client = new Client({
      webSocketFactory: () => new SockJS("/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str),
      onConnect: () => {
        setConnected(true);

        client.subscribe("/topic/public", (payload) => {
          const message = JSON.parse(payload.body);
          if (!selectedUserRef.current) {
             setMessages((prev) => [...prev, message]);
          }
          if (message.type === "JOIN" || message.type === "LEAVE") {
            fetchActiveUsers();
          }
        });

        // Private message listener
        client.subscribe(`/user/${username}/queue/messages`, (payload) => {
          const message = JSON.parse(payload.body);

          if (selectedUserRef.current && message.sender === selectedUserRef.current.username) {
             setMessages((prev) => [...prev, message]);
             client.publish({
               destination: "/app/chat.read",
               body: JSON.stringify({ reader: username, sender: message.sender })
             });
          } else if (message.sender !== username) {
             // --- NEW: Increment Unread Badge Counter ---
             setUnreadCounts((prev) => ({
               ...prev,
               [message.sender]: (prev[message.sender] || 0) + 1
             }));
          }
        });

        // Read receipt listener
        client.subscribe(`/user/${username}/queue/receipts`, (payload) => {
          const receipt = JSON.parse(payload.body);
          setMessages((prev) => prev.map(msg =>
            (msg.sender === username && msg.recipient === receipt.reader)
              ? { ...msg, read: true }
              : msg
          ));
        });

        // --- NEW: Typing Indicator listener ---
        client.subscribe(`/user/${username}/queue/typing`, (payload) => {
          const typingMsg = JSON.parse(payload.body);
          if (selectedUserRef.current && selectedUserRef.current.username === typingMsg.sender) {
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
          }
        });

        client.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: username, type: "JOIN" }),
        });
      },
      onStompError: (frame) => console.error("Broker reported error: " + frame.headers["message"]),
      onWebSocketClose: () => setConnected(false),
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [token, username, fetchActiveUsers]);

  // Handle Input typing trigger
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (selectedUser && stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/app/chat.typing",
        body: JSON.stringify({ sender: username, recipient: selectedUser.username })
      });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && stompClientRef.current?.connected) {
      const destination = selectedUser ? `/app/chat.private` : "/app/chat.sendMessage";

      const chatMessage = {
        sender: username,
        content: messageInput,
        type: "CHAT",
        recipient: selectedUser ? selectedUser.username : null,
        read: false
      };

      stompClientRef.current.publish({
        destination: destination,
        body: JSON.stringify(chatMessage),
      });

      if (selectedUser) {
         setMessages((prev) => [...prev, chatMessage]);
      }

      setMessageInput("");
    }
  };

  const handleLogout = () => {
    if (stompClientRef.current) stompClientRef.current.deactivate();
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_username");
    window.location.reload();
  };

  const getUserProfile = (targetUsername) => activeUsers.find((u) => u.username === targetUsername);

  const getDisplayName = (targetUsername) => {
    const profile = getUserProfile(targetUsername);
    return profile?.displayName || targetUsername;
  };

  const getDisplayAvatar = (targetUsername) => {
    const profile = getUserProfile(targetUsername);
    return profile?.avatarBase64 || null;
  };

  const getDisplayColor = (targetUsername) => {
    const profile = getUserProfile(targetUsername);
    if (profile?.themeColor) return profile.themeColor;

    const palette = ["#E8A33D", "#6FCF97", "#7B9FE0", "#E88F6E", "#B08BE0", "#5FC4C9"];
    let hash = 0;
    for (let i = 0; i < targetUsername.length; i++) hash = 31 * hash + targetUsername.charCodeAt(i);
    return palette[Math.abs(hash % palette.length)];
  };

  const currentUser = getUserProfile(username);
  const otherUsers = activeUsers.filter((u) => u.username !== username);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onProfileUpdate={fetchActiveUsers}
      />

      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 shrink-0" style={{ background: COLORS.panel, borderRight: `1px solid ${COLORS.cardBorder}` }}>
        <div className="px-5 py-5 shrink-0" style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: COLORS.brass, textTransform: "uppercase" }}>
            Roster · {activeUsers.length} online
          </div>

          {currentUser && (
            <div className="mt-4 flex items-center gap-3 p-2.5 rounded-xl shadow-sm relative group" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.cardBorder}` }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 overflow-hidden"
                style={{ background: getDisplayColor(currentUser.username), color: COLORS.ink }}
              >
                {getDisplayAvatar(currentUser.username) ? (
                    <img src={getDisplayAvatar(currentUser.username)} alt="DP" className="w-full h-full object-cover" />
                ) : (
                    currentUser.username[0].toUpperCase()
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate" style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>
                    {getDisplayName(currentUser.username)}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.sage }}></div>
                    <span style={{ color: COLORS.sage, fontSize: 9, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Active</span>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="ml-auto text-gray-400 hover:text-white transition-colors"
                title="Profile Settings"
              >
                ⚙️
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto crt-scroll p-3 space-y-1 min-h-0">
          <div
            className="crt-row flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
            style={{ background: !selectedUser ? "rgba(255,255,255,0.05)" : "transparent" }}
            onClick={() => handleUserSelect(null)}
          >
            <span style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}># Public Channel</span>
          </div>

          {otherUsers.map((user) => {
            const unreadCount = unreadCounts[user.username] || 0;
            return (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="crt-row flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors"
                style={{ background: selectedUser?.username === user.username ? "rgba(255,255,255,0.05)" : "transparent" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm overflow-hidden"
                      style={{ background: getDisplayColor(user.username), color: COLORS.ink }}
                    >
                      {getDisplayAvatar(user.username) ? (
                        <img src={getDisplayAvatar(user.username)} alt="DP" className="w-full h-full object-cover" />
                      ) : (
                        user.username[0].toUpperCase()
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ background: COLORS.sage, border: `2px solid ${COLORS.panel}` }} />
                  </div>
                  <span className="truncate" style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>
                    {getDisplayName(user.username)}
                  </span>
                </div>

                {/* --- NEW: Unread Badge Indicator --- */}
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold shrink-0" style={{ background: COLORS.brass, color: COLORS.ink }}>
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 shrink-0" style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <button onClick={handleLogout} className="w-full py-2 rounded text-sm font-medium transition-colors hover:bg-red-500 hover:text-white" style={{ color: COLORS.danger, border: `1px solid ${COLORS.danger}` }}>
            Disconnect
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: COLORS.panel, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: COLORS.text, letterSpacing: "-0.01em" }}>
              {selectedUser ? `Secure comms: @${getDisplayName(selectedUser.username)}` : "Public Chatroom"}
            </h2>
            {/* --- NEW: Typing Indicator Subtitle --- */}
            {selectedUser && isTyping && (
              <span className="text-xs animate-pulse" style={{ color: COLORS.sage, fontFamily: "'IBM Plex Mono', monospace" }}>
                typing...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <SignalBars connected={connected} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: connected ? COLORS.sage : COLORS.danger }}>
              {connected ? "Connected" : "Connecting"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto crt-scroll px-6 py-5 min-h-0" style={{ background: COLORS.ink }}>
          <ul className="space-y-3 w-full" style={{ maxWidth: 880, marginLeft: "auto", marginRight: "auto" }}>
            {messages.map((msg, index) => (
              <li key={index}>
                {msg.type === "JOIN" || msg.type === "LEAVE" ? (
                  <div className="crt-ticker flex items-center gap-3 my-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.mutedDim }}>
                    <span style={{ flex: 1, borderTop: `1px dotted ${COLORS.cardBorder}` }} />
                    <span>{getDisplayName(msg.sender)} {msg.type === "JOIN" ? "joined" : "left"} the wire</span>
                    <span style={{ flex: 1, borderTop: `1px dotted ${COLORS.cardBorder}` }} />
                  </div>
                ) : (
                  <div className={`crt-bubble flex items-end gap-2 ${msg.sender === username ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 overflow-hidden"
                      style={{ background: getDisplayColor(msg.sender), color: COLORS.ink }}
                    >
                      {getDisplayAvatar(msg.sender) ? (
                         <img src={getDisplayAvatar(msg.sender)} alt="DP" className="w-full h-full object-cover" />
                      ) : (
                         msg.sender[0].toUpperCase()
                      )}
                    </div>

                    <div className={`flex flex-col ${msg.sender === username ? "items-end" : "items-start"}`} style={{ maxWidth: "70%" }}>
                      <span className="flex items-center gap-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.mutedDim, marginBottom: 4, padding: "0 2px" }}>
                        {getDisplayName(msg.sender)}
                        {msg.sender === username && selectedUser && (
                            <span style={{
                              color: msg.read || msg.isRead ? COLORS.sage : COLORS.mutedDim,
                              fontSize: 13,
                              letterSpacing: "-0.2em",
                              transform: "translateY(1px)",
                              transition: "color 0.3s ease"
                            }}>
                              ✓✓
                            </span>
                        )}
                      </span>
                      <div className="px-4 py-2.5" style={{ background: msg.sender === username ? getDisplayColor(username) : COLORS.card, color: msg.sender === username ? COLORS.ink : COLORS.text, borderRadius: msg.sender === username ? "16px 16px 4px 16px" : "16px 16px 16px 4px", border: msg.sender === username ? "none" : `1px solid ${COLORS.cardBorder}`, fontSize: 14.5, lineHeight: 1.5 }}>
                        <p style={{ overflowWrap: "anywhere" }}>{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>

        <div className="p-4 shrink-0" style={{ background: COLORS.panel, borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <form onSubmit={sendMessage} className="flex gap-3 w-full" style={{ maxWidth: 880, marginLeft: "auto", marginRight: "auto" }}>
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange} // <-- UPDATED to trigger typing socket
              placeholder={selectedUser ? `Message @${getDisplayName(selectedUser.username)}...` : "Type your message here..."}
              disabled={!connected}
              className="crt-input flex-1 px-4 py-3 rounded-full focus:outline-none transition-shadow w-full"
              style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, fontSize: 14.5 }}
            />
            <button
              type="submit"
              disabled={!connected || !messageInput.trim()}
              className="crt-send px-6 py-3 rounded-full font-semibold transition-colors shadow-md shrink-0"
              style={{ background: !connected || !messageInput.trim() ? COLORS.brassDim : getDisplayColor(username), color: COLORS.ink, opacity: !connected || !messageInput.trim() ? 0.5 : 1, border: "none", cursor: !connected || !messageInput.trim() ? "not-allowed" : "pointer" }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;