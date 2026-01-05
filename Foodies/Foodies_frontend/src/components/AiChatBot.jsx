import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, Bot } from "lucide-react"; // Removed unused 'User'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion as Motion, AnimatePresence } from "framer-motion";

// ⚠️ PASTE THE NEW KEY HERE (Created in a "New Project")
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

const genAI = new GoogleGenerativeAI(API_KEY);

const AiChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi! I'm Foodie Bot 🤖. Hungry? Ask me for recommendations like 'Spicy Pizza' or 'Best Burger'!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // FIX: Use 'gemini-1.5-flash' with a FRESH key. 
      // If this still fails, try 'gemini-1.0-pro'
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const context = `
        You are 'Foodie Bot', a helpful AI assistant for a food delivery app.
        Your tone is fun, energetic, and appetizing. 😋
        Recommend foods like Burgers, Pizzas, Sushi, and Indian Curry.
        Keep answers short (under 50 words).
      `;

      const result = await model.generateContent(`${context}\n\nUser: ${input}`);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "model", text: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Oops! My brain froze 🥶. (Check API Key permissions)" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 shadow-2xl"
          >
            <Card className="border-purple-500/50 bg-zinc-900 text-white overflow-hidden">
              <CardHeader className="bg-purple-600 p-3 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bot size={18} className="text-white" /> Foodie AI
                </CardTitle>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-purple-700" onClick={() => setIsOpen(false)}>
                  <X size={14} />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={scrollRef} className="h-64 overflow-y-auto p-4 space-y-3 bg-zinc-950/50">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {loading && <div className="text-xs text-zinc-500 p-2">Cooking... 🍳</div>}
                </div>
                <div className="p-2 border-t border-zinc-800 flex gap-2 bg-zinc-900">
                  <Input 
                    className="h-9 bg-zinc-950 border-zinc-700 text-xs focus-visible:ring-purple-500" 
                    placeholder="Ask for food..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                  />
                  <Button size="icon" className="h-9 w-9 bg-purple-600 hover:bg-purple-700" onClick={handleSend} disabled={loading}>
                    <Send size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Motion.div>
        )}
      </AnimatePresence>
      <Motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg flex items-center justify-center border-2 border-white/20 hover:border-white/50 transition-colors"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </Motion.button>
    </div>
  );
};

export default AiChatBot;