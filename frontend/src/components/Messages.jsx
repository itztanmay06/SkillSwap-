import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

// Initial peer contacts
const initialContacts = [
  {
    id: "c-vanshika",
    name: "Vanshika Sharma",
    role: "UI/UX Designer",
    online: true,
    initialMessage: "Hey Tanmay! I saw your React skills. Would love to swap some Figma design tips for frontend hooks."
  },
  {
    id: "c-vanshika-jindal",
    name: "Vanshika Jindal",
    role: "Acoustic Guitar Basics",
    online: false,
    initialMessage: "Hey! Ready for the weekend guitar strumming session?"
  },
  {
    id: "c-ayush",
    name: "Tanmay",
    role: "SEO & Growth Marketing",
    online: true,
    initialMessage: "Hello! Let me know when you want to look at SEO strategies."
  }
];

export default function Messages() {
  const { activeChatUser, setActiveChatUser } = useApp();
  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(initialContacts[0].id);

  // Chat threads per contact ID
  const [threads, setThreads] = useState({
    "c-vanshika": [
      { id: 2, sender: "them", text: "Hey! Let's swap Figma design principles for React state tips.", time: "Yesterday" }
    ],
    "c-vanshika-jindal": [
      { id: 3, sender: "them", text: "Hey Tanmay, ready for the weekend acoustic guitar lesson?", time: "Monday" }
    ],
    "c-ayush": [
      { id: 4, sender: "them", text: "Hello! Let me know if you want to optimize your project for SEO.", time: "Sep 25" }
    ]
  });

  const [text, setText] = useState("");

  // Sync when activeChatUser is changed from outside (e.g. clicking Message on peer profile)
  useEffect(() => {
    if (activeChatUser && activeChatUser.name) {
      // Check if contact already exists
      const existing = contacts.find((c) => c.name.toLowerCase() === activeChatUser.name.toLowerCase());
      if (existing) {
        setActiveId(existing.id);
      } else {
        // Add new contact to list
        const newContact = {
          id: "c-" + Date.now(),
          name: activeChatUser.name,
          role: activeChatUser.role || "Peer Mentor",
          online: true
        };
        setContacts([newContact, ...contacts]);
        setActiveId(newContact.id);
        setThreads((prev) => ({
          ...prev,
          [newContact.id]: [
            { id: Date.now(), sender: "them", text: `Hi Tanmay! Thanks for reaching out. How can I help you?`, time: "Just now" }
          ]
        }));
      }
    }
  }, [activeChatUser]);

  const activeContact = contacts.find((c) => c.id === activeId) || contacts[0];
  const currentMessages = threads[activeContact.id] || [];

  // Send message handler
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const sentText = text.trim();
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: sentText,
      time: "Just now"
    };

    setThreads((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }));
    setText("");

    // Realistic auto-reply from peer after 900ms
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        sender: "them",
        text: `Got your message! Sounds good to me, let's coordinate the skill exchange session.`,
        time: "Just now"
      };
      setThreads((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), replyMsg]
      }));
    }, 900);
  };

  return (
    <div className="page">
      {/* Top Header Bar */}
      <Header title="Messages" subtitle="Chat and coordinate skill barter sessions with peers in real-time." />

      <div className="messages-layout">
        {/* Left: Conversations List */}
        <div className="contacts-list">
          <h3 style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", fontSize: 14 }}>Conversations</h3>
          {contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setActiveId(c.id);
                if (setActiveChatUser) setActiveChatUser(c);
              }}
              className={"contact-item " + (c.id === activeContact.id ? "active" : "")}
            >
              <Avatar name={c.name} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: 14, display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {c.name}
                </strong>
                <p className="text-muted text-sm" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {c.role}
                </p>
              </div>
              {c.online && <span className="online-dot" title="Online"></span>}
            </div>
          ))}
        </div>

        {/* Right: Active Chat Conversation Pane */}
        <div className="chat-pane">
          {/* Chat Header showing that specific profile */}
          <div className="chat-header">
            <Avatar name={activeContact.name} size="sm" />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 15 }}>{activeContact.name}</strong>
              <span className="text-muted text-sm" style={{ display: "block", color: activeContact.online ? "#16a34a" : "#64748b" }}>
                {activeContact.online ? "● Online" : "○ Offline"} • {activeContact.role}
              </span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="chat-body">
            {currentMessages.map((m) => (
              <div key={m.id} className={"chat-bubble " + (m.sender === "me" ? "me" : "them")}>
                <p style={{ margin: 0 }}>{m.text}</p>
                <span className="chat-time">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSend} className="chat-footer">
            <input
              type="text"
              placeholder={`Message ${activeContact.name.split(" ")[0]}...`}
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
