import { useState, useEffect } from "react";

const COLORS = {
  bg0: "#0A0C1B",
  bg1: "#12152B",
  glass: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.09)",
  iris: "#7C6FFF",
  irisDim: "#5B4FCC",
  aqua: "#45D8C0",
  coral: "#FF6B81",
  text: "#EEF0FA",
  muted: "#9498BE",
  mutedDim: "#5F6389",
};

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes auroraA {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
  50% { transform: translate(40px, -30px) scale(1.15); opacity: 0.8; }
}
@keyframes auroraB {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
  50% { transform: translate(-30px, 40px) scale(1.1); opacity: 0.7; }
}
@keyframes ringSpin {
  to { transform: rotate(360deg); }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes fieldIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shakeX {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes msgIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.aa-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; mix-blend-mode: screen; }
.aa-ringwrap { position: relative; border-radius: 26px; padding: 1.5px; }
.aa-ringwrap::before {
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  width: 180%; height: 180%;
  background: conic-gradient(from 0deg, transparent 0%, ${COLORS.iris} 12%, transparent 28%, transparent 55%, ${COLORS.aqua} 68%, transparent 82%);
  animation: ringSpin 7s linear infinite;
  transform: translate(-50%, -50%);
}
.aa-card {
  animation: cardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  position: relative;
  z-index: 1;
}
.aa-shake { animation: shakeX 0.4s ease; }
.aa-field { animation: fieldIn 0.4s ease backwards; }
.aa-input { transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; }
.aa-input:focus {
  outline: none;
  border-color: ${COLORS.iris} !important;
  box-shadow: 0 0 0 4px rgba(124,111,255,0.18);
  background: rgba(255,255,255,0.06) !important;
}
.aa-input::placeholder { color: ${COLORS.mutedDim}; }
.aa-btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.25s ease, filter 0.2s ease;
}
.aa-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px -8px rgba(124,111,255,0.55);
  filter: brightness(1.06);
}
.aa-btn:not(:disabled):active { transform: translateY(0px) scale(0.99); }
.aa-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.32) 45%, transparent 60%);
  transform: translateX(-120%);
  transition: transform 0.6s ease;
}
.aa-btn:not(:disabled):hover::after { transform: translateX(120%); }
.aa-toggle { transition: color 0.2s ease; position: relative; }
.aa-toggle::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 1px;
  background: ${COLORS.iris};
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
}
.aa-toggle:hover::after { transform: scaleX(1); }
.aa-toggle:hover { color: ${COLORS.text} !important; }
.aa-tab { transition: color 0.25s ease; cursor: pointer; }
.aa-spinner {
  width: 15px; height: 15px;
  border-radius: 50%;
  border: 2px solid rgba(10,12,27,0.35);
  border-top-color: ${COLORS.bg0};
  animation: spin 0.7s linear infinite;
}
.aa-msg { animation: msgIn 0.3s ease; }
`;

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text);
      }

      if (isLogin) {
        onLoginSuccess(text, username);
      } else {
        setMessage({
          text: "Registration successful. Please log in.",
          type: "success",
        });
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      setMessage({
        text: error.message || "Authentication failed",
        type: "error",
      });
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toLogin) => {
    if (toLogin === isLogin) return;
    setIsLogin(toLogin);
    setMessage({ text: "", type: "" });
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden px-4"
      style={{ background: COLORS.bg0, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{FONT_IMPORT}</style>

      {/* Ambient aurora background */}
      <div
        className="aa-orb"
        style={{
          width: 460,
          height: 460,
          top: "-10%",
          left: "-8%",
          background: `radial-gradient(circle, ${COLORS.iris}55, transparent 70%)`,
          animation: "auroraA 15s ease-in-out infinite",
        }}
      />
      <div
        className="aa-orb"
        style={{
          width: 420,
          height: 420,
          bottom: "-12%",
          right: "-10%",
          background: `radial-gradient(circle, ${COLORS.aqua}44, transparent 70%)`,
          animation: "auroraB 17s ease-in-out infinite",
        }}
      />
      <div
        className="aa-orb"
        style={{
          width: 300,
          height: 300,
          top: "45%",
          right: "22%",
          background: `radial-gradient(circle, ${COLORS.coral}22, transparent 70%)`,
          animation: "auroraA 13s ease-in-out infinite reverse",
        }}
      />

      {mounted && (
        <div
          className={`aa-ringwrap w-full max-w-md ${shake ? "aa-shake" : ""}`}
        >
          <div
            className="aa-card rounded-[25px] p-8 sm:p-10"
            style={{
              background: "rgba(18,21,43,0.72)",
              border: `1px solid ${COLORS.border}`,
              boxShadow:
                "0 24px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Brand mark */}
            <div className="flex flex-col items-center mb-7">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.iris}, ${COLORS.aqua})`,
                  boxShadow: "0 8px 24px -6px rgba(124,111,255,0.55)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: COLORS.bg0,
                  }}
                >
                  W
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 26,
                  color: COLORS.text,
                  letterSpacing: "-0.01em",
                }}
              >
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: COLORS.mutedDim,
                  marginTop: 6,
                }}
              >
                {isLogin ? "Sign in to continue" : "Join the conversation"}
              </p>
            </div>

            {/* Tab switch */}
            <div
              className="relative flex mb-7 rounded-full p-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                className="absolute top-1 bottom-1 rounded-full transition-transform duration-300 ease-out"
                style={{
                  width: "calc(50% - 4px)",
                  left: 4,
                  background: `linear-gradient(135deg, ${COLORS.iris}, ${COLORS.irisDim})`,
                  transform: isLogin ? "translateX(0)" : "translateX(100%)",
                  boxShadow: "0 4px 16px -4px rgba(124,111,255,0.6)",
                }}
              />
              <button
                type="button"
                className="aa-tab relative z-10 flex-1 py-2 text-sm font-medium rounded-full"
                style={{ color: isLogin ? COLORS.text : COLORS.muted }}
                onClick={() => switchMode(true)}
              >
                Login
              </button>
              <button
                type="button"
                className="aa-tab relative z-10 flex-1 py-2 text-sm font-medium rounded-full"
                style={{ color: !isLogin ? COLORS.text : COLORS.muted }}
                onClick={() => switchMode(false)}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="aa-field" style={{ animationDelay: "0.05s" }}>
                <label
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: COLORS.mutedDim,
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. pritam"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="aa-input w-full mt-1.5 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                  }}
                />
              </div>

              <div className="aa-field" style={{ animationDelay: "0.12s" }}>
                <label
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: COLORS.mutedDim,
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="aa-input w-full mt-1.5 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="aa-btn w-full py-3 rounded-xl font-semibold text-sm mt-2 flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? COLORS.irisDim
                    : `linear-gradient(135deg, ${COLORS.iris}, ${COLORS.aqua})`,
                  color: COLORS.bg0,
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading && <span className="aa-spinner" />}
                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Start chatting"
                    : "Register"}
              </button>
            </form>

            <p
              className="aa-toggle text-center text-sm mt-5 cursor-pointer"
              style={{ color: COLORS.muted }}
              onClick={() => switchMode(!isLogin)}
            >
              {isLogin
                ? "Need an account? Register here."
                : "Already have an account? Login here."}
            </p>

            {message.text && (
              <div
                className="aa-msg flex items-center gap-2 justify-center mt-5 px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{
                  background:
                    message.type === "error"
                      ? "rgba(255,107,129,0.12)"
                      : "rgba(69,216,192,0.12)",
                  border: `1px solid ${message.type === "error" ? COLORS.coral : COLORS.aqua}55`,
                  color: message.type === "error" ? COLORS.coral : COLORS.aqua,
                }}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
