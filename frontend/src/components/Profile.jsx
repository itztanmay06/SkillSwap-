import React, { useState } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

// Yeh user profile aur skills manage karne ka page component hai
export default function Profile() {
  const { user, setUser } = useApp();
  const [newSkill, setNewSkill] = useState("");
  const [newWish, setNewWish] = useState("");

  // Edit Profile Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "Tanmay Mittal",
    title: user.title || "Full Stack MERN Developer & Student",
    location: user.location || "Delhi, India",
    bio: user.bio || "Passionate about building scalable web applications and exchanging knowledge in React, Node, and DSA."
  });

  // Save edited profile handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      title: formData.title.trim(),
      location: formData.location.trim(),
      bio: formData.bio.trim()
    };

    setUser(updatedUser);
    setIsEditing(false);

    // Backend API par profile update call karna
    fetch(`http://localhost:5000/api/auth/user/${user.email || "tanmay@example.com"}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    }).catch(() => {});

    alert("Profile updated successfully!");
  };

  // Yeh teaching skill add karne ka function hai
  const addOffered = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setUser({ ...user, skillsOffered: [...user.skillsOffered, newSkill.trim()] });
    setNewSkill("");
  };

  // Yeh teaching skill delete karne ka function hai
  const removeOffered = (skill) => {
    setUser({ ...user, skillsOffered: user.skillsOffered.filter((s) => s !== skill) });
  };

  // Yeh learning wishlist skill add karne ka function hai
  const addWanted = (e) => {
    e.preventDefault();
    if (!newWish.trim()) return;
    setUser({ ...user, skillsWanted: [...user.skillsWanted, newWish.trim()] });
    setNewWish("");
  };

  // Yeh learning wishlist skill delete karne ka function hai
  const removeWanted = (wish) => {
    setUser({ ...user, skillsWanted: user.skillsWanted.filter((w) => w !== wish) });
  };

  return (
    <div className="page">
      {/* Yeh top header bar hai */}
      <Header title="My Profile" subtitle="Manage your taught skills, learning wishlist, and student reputation." />

      {/* Yeh user profile summary card hai */}
      <div className="panel profile-card">
        <div className="profile-header-row" style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <Avatar name={user.name} size="lg" />
          <div style={{ flex: 1 }}>
            <h2 className="profile-name" style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
            <p className="profile-title" style={{ margin: "4px 0", color: "#16a34a", fontWeight: 600 }}>{user.title}</p>
            <p className="text-muted text-sm">📍 {user.location || "Delhi, India"} • 📅 {user.joinedDate || "January 2026"}</p>
            {user.bio && (
              <p style={{ fontSize: 13, color: "#475569", marginTop: 8, lineHeight: 1.5, maxWidth: "600px" }}>
                {user.bio}
              </p>
            )}
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => {
              setFormData({
                name: user.name || "Tanmay Mittal",
                title: user.title || "Full Stack MERN Developer & Student",
                location: user.location || "Delhi, India",
                bio: user.bio || "Passionate about building scalable web applications and exchanging knowledge in React, Node, and DSA."
              });
              setIsEditing(!isEditing);
            }}
            className="btn-outline"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 14px", flexShrink: 0 }}
          >
            ✏️ {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Inline Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Edit Profile Details</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxBox: "border-box" }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Headline / Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>About / Bio</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn-green">
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Yeh 5 stats ki strip hai (Points, Rating, Completed, Teaching, Learning) */}
        <div className="stats-strip" style={{ marginTop: isEditing ? 20 : 16 }}>
          <div><div className="strip-val">{user.points}</div><div className="strip-label">Skill Points</div></div>
          <div><div className="strip-val">⭐ {user.reviewCount > 0 ? (user.rating || 5.0).toFixed(1) : "0.0"}</div><div className="strip-label">Rating</div></div>
          <div><div className="strip-val">{user.completed ?? 0}</div><div className="strip-label">Completed</div></div>
          <div><div className="strip-val">{user.skillsOffered ? user.skillsOffered.length : 0}</div><div className="strip-label">Teaching</div></div>
          <div><div className="strip-val">{user.skillsWanted ? user.skillsWanted.length : 0}</div><div className="strip-label">Learning</div></div>
        </div>
      </div>

      {/* Yeh Skills Offered (jo skills aap padha sakte ho) ka section hai */}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title">Skills Offered (What you teach)</h3>
        {(!user.skillsOffered || user.skillsOffered.length === 0) ? (
          <p className="text-muted text-sm" style={{ margin: "10px 0" }}>No skills offered yet. Add a skill you can teach below.</p>
        ) : (
          <div className="tags-row">
            {user.skillsOffered.map((s) => (
              <span className="tag-pill green" key={s}>
                {s} <button className="tag-close" onClick={() => removeOffered(s)}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Yeh naya teaching skill add karne ka form hai */}
        <form onSubmit={addOffered} className="add-tag-form">
          <input
            type="text"
            placeholder="Add new skill you can teach..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button type="submit" className="btn-green-sm">+ Add Skill</button>
        </form>
      </div>

      {/* Yeh Skills Wanted (jo skills aap seekhna chahte ho) ka section hai */}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title">Skills Wanted (What you want to learn)</h3>
        {(!user.skillsWanted || user.skillsWanted.length === 0) ? (
          <p className="text-muted text-sm" style={{ margin: "10px 0" }}>No wishlist skills yet. Add a skill you want to learn below.</p>
        ) : (
          <div className="tags-row">
            {user.skillsWanted.map((w) => (
              <span className="tag-pill" key={w}>
                {w} <button className="tag-close" onClick={() => removeWanted(w)}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Yeh naya wishlist skill add karne ka form hai */}
        <form onSubmit={addWanted} className="add-tag-form">
          <input
            type="text"
            placeholder="Add new skill you want to learn..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
          />
          <button type="submit" className="btn-outline-sm">+ Add Wishlist</button>
        </form>
      </div>
    </div>
  );
}
