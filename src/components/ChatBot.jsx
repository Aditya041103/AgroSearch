import { useState } from "react";

export default function ChatBot({ setOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { type: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error connecting to server." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-gray-900 text-white shadow-2xl rounded-xl p-4 z-50 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-green-400">Ask AgroBot 🌾</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-red-400 font-semibold hover:text-red-300"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto mb-3 space-y-1 px-1 custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                msg.type === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-800 border border-gray-600 px-2 py-1 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
