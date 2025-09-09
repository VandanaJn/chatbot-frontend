import React, { useState } from "react";
import "./App.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text:
        "Namaste. I am AtmaBandhu—your spiritual friend and companion on the path within. Whether you seek guidance, reflection, or simply presence, I am here to support your journey.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "vj",
          text: input
        }),
      });

      const data = await response.json();
      const botMessage: Message = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🌿 There was a moment of stillness in our connection. Let us pause, breathe, and try again shortly. I remain here with you.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🧘‍♂️ AtmaBandhu</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-container ${msg.sender}`}>
            {msg.sender === "bot" && <div className="avatar bot-avatar" />}
            <div className={`message-bubble ${msg.sender === "bot" ? "bot-bubble" : "user-bubble"}`}>
              {msg.text}
            </div>
            {msg.sender === "user" && <div className="avatar user-avatar" />}
          </div>
        ))}

        {typing && <div className="typing-indicator">AtmaBandhu is thinking...</div>}
      </div>
      <form className="input-area" onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your question..."
        />
        <button type="submit">Send</button>
      </form>

    </div>
  );
}

export default App;