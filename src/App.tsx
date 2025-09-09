import { useState } from "react";
import axios from "axios";
import "./App.css"; // make sure this line is here

type Message = {
  sender: "user" | "bot";
  text: string;
  typing?: boolean; // new flag for spinner
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "I can answer based on Autobiography of a Yogi. Ask your question." }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    // add typing placeholder
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "bot", text: "", typing: true }]);

    try {
      const res = await axios.post<{ reply: string }>(
        "http://127.0.0.1:8000/chat",
        {
          text: userMessage,
          user_id: "vj"
        },
        { timeout: 15000 }
      );

      const botReply = res.data.reply;

      // replace typing spinner with reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: botReply };
        return updated;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "⚠️ Error connecting to server."
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Chatbot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          height: "600px",
          width: "400px",
          overflowY: "auto",
          marginBottom: "1rem"
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            {msg.typing ? (
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              <p>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Type a message..."
          style={{ flex: 1, padding: "0.5rem" }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default App;
