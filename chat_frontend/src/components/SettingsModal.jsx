import { useState, useRef } from "react";

const THEME_OPTIONS = [
  "#7C6FFF", // Iris (Default)
  "#45D8C0", // Aqua
  "#FF6B81", // Coral
  "#E8A33D", // Brass
  "#6FCF97", // Sage
  "#B08BE0", // Lavender
];

const SettingsModal = ({ isOpen, onClose, currentUser, onProfileUpdate }) => {
  const [displayName, setDisplayName] = useState(currentUser?.displayName || currentUser?.username || "");
  const [themeColor, setThemeColor] = useState(currentUser?.themeColor || THEME_OPTIONS[0]);
  const [avatarBase64, setAvatarBase64] = useState(currentUser?.avatarBase64 || null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Convert uploaded image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          displayName,
          themeColor,
          avatarBase64,
        }),
      });

      if (response.ok) {
        onProfileUpdate(); // Tell ChatRoom to refresh data
        onClose();         // Close the modal
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,12,27,0.8)", backdropFilter: "blur(8px)" }}>
      <div 
        className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
        style={{ background: "rgba(27,35,64,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Profile Settings
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold cursor-pointer relative group overflow-hidden shadow-lg"
              style={{ background: themeColor, color: "#0A0C1B" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarBase64 ? (
                <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                displayName[0]?.toUpperCase() || currentUser?.username[0]?.toUpperCase()
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs uppercase tracking-wider">Change</span>
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>

          {/* Display Name Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all text-white"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Theme Color Picker */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Identity Color
            </label>
            <div className="flex gap-3 justify-between">
              {THEME_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setThemeColor(color)}
                  className={`w-10 h-10 rounded-full transition-transform ${themeColor === color ? 'scale-125 shadow-lg' : 'hover:scale-110'}`}
                  style={{ background: color, border: themeColor === color ? "2px solid white" : "none" }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-xl font-semibold mt-4 transition-all"
            style={{ background: themeColor, color: "#0A0C1B", opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;