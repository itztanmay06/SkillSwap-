import React, { useState } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";

// Yeh contact list ka sample data hai
const contacts = [
  {
    id: "c1",
    name: "Testing",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    online: true
  }
];

// Yeh chat messaging page component hai
export default function Messages() {
  const [activeContact] = useState(contacts[0]);
  
  // Yeh messages list ka state hai
  const [messages, setMessages] = useState([
    { id: 1, sender: "them", text: "Hi", time: "Just now" }
  ]);
  const [text, setText] = useState("");

  // Yeh naya message send karne ka handler function hai
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), sender: "me", text: text.trim(), time: "Just now" };
    setMessages([...messages, newMsg]);
    setText("");
  };

  return (
    <div className="page">
      {/* Yeh top header bar hai */}
      <Header title="Messages" subtitle="Chat and coordinate skill sessions with peers in real-time." />

      <div className="messages-layout">
        {/* Yeh left side ki conversations list hai */}
        <div className="contacts-list">
          <h3 style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", fontSize: 14 }}>Conversations</h3>
          {contacts.map((c) => (
            <div key={c.id} className="contact-item active">
              <Avatar name={c.name} size="sm" />
              <div style={{ flex: 1 }}>
                <strong>{c.name}</strong>
                <p className="text-muted text-sm">{c.role}</p>
              </div>
              {c.online && <span className="online-dot"></span>}
            </div>
          ))}
        </div>

        {/* Yeh right side ka chat conversation pane hai */}
        <div className="chat-pane">
          {/* Chat Header */}
          <div className="chat-header">
            <Avatar name={activeContact.name} size="sm" />
            <div>
              <strong>{activeContact.name}</strong>
              <span className="text-muted text-sm" style={{ display: "block" }}>● Online</span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="chat-body">
            {messages.map((m) => (
              <div key={m.id} className={"chat-bubble " + (m.sender === "me" ? "me" : "them")}>
                <p>{m.text}</p>
                <span className="chat-time">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSend} className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn-green-sm">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
