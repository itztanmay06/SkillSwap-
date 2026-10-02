import React, { useState } from "react";
import Header from "../layout/Header";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" };

export default function Profile() {
  const { user, setUser, addSkill } = useApp();
  const [newSkill, setNewSkill] = useState("");
  const [newWish, setNewWish] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "Tanmay Mittal",
    title: user.title || "Full Stack MERN Developer & Student",
    location: user.location || "Delhi, India",
    bio: user.bio || "Passionate about building scalable web applications and exchanging knowledge in React, Node, and DSA."
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Name cannot be empty!");
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    setIsEditing(false);

    fetch(`http://localhost:5000/api/auth/user/${user.email || "tanmay@example.com"}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    }).catch(() => {});
    alert("Profile updated successfully!");
  };

  const addOffered = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const skillName = newSkill.trim();
    setUser({ ...user, skillsOffered: [...user.skillsOffered, skillName] });
    if (addSkill) addSkill({ title: skillName, category: "Programming" });
    setNewSkill("");
    alert(`"${skillName}" published! A new card is now live on Explore Skills.`);
  };

  const removeOffered = (s) => setUser({ ...user, skillsOffered: user.skillsOffered.filter((x) => x !== s) });

  const addWanted = (e) => {
    e.preventDefault();
    if (!newWish.trim()) return;
    setUser({ ...user, skillsWanted: [...user.skillsWanted, newWish.trim()] });
    setNewWish("");
  };

  const removeWanted = (w) => setUser({ ...user, skillsWanted: user.skillsWanted.filter((x) => x !== w) });

  return (
    <div className="page">
      <Header title="My Profile" subtitle="Manage your taught skills, learning wishlist, and student reputation." />

      <div className="panel profile-card">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <Avatar name={user.name} size="lg" />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
            <p style={{ margin: "4px 0", color: "#16a34a", fontWeight: 600 }}>{user.title}</p>
            <p className="text-muted text-sm">📍 {user.location || "Delhi, India"} • 📅 Joined {user.joinedDate || "Sept 2026"}</p>
            {user.bio && <p style={{ fontSize: 13, color: "#475569", marginTop: 8, lineHeight: 1.5 }}>{user.bio}</p>}
          </div>

          <button onClick={() => setIsEditing(!isEditing)} className="btn-outline" style={{ padding: "8px 14px", fontSize: 13 }}>
            ✏️ {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Full Name</label>
                <input type="text" style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Headline / Title</label>
                <input type="text" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Location</label>
              <input type="text" style={inputStyle} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>About / Bio</label>
              <textarea rows={2} style={inputStyle} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">Cancel</button>
              <button type="submit" className="btn-green">Save Changes</button>
            </div>
          </form>
        )}

        <div className="stats-strip" style={{ marginTop: 16 }}>
          <div><div className="strip-val">{user.points}</div><div className="strip-label">Skill Points</div></div>
          <div><div className="strip-val">⭐ {user.reviewCount > 0 ? (user.rating || 5.0).toFixed(1) : "0.0"}</div><div className="strip-label">Rating</div></div>
          <div><div className="strip-val">{user.completed ?? 0}</div><div className="strip-label">Completed</div></div>
          <div><div className="strip-val">{user.skillsOffered?.length || 0}</div><div className="strip-label">Teaching</div></div>
          <div><div className="strip-val">{user.skillsWanted?.length || 0}</div><div className="strip-label">Learning</div></div>
        </div>
      </div>

      {}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title">Skills Offered (What you teach)</h3>
        <div className="tags-row" style={{ margin: "10px 0" }}>
          {user.skillsOffered?.map((s) => (
            <span className="tag-pill green" key={s}>
              {s} <button className="tag-close" onClick={() => removeOffered(s)}>×</button>
            </span>
          ))}
        </div>
        <form onSubmit={addOffered} className="add-tag-form">
          <input type="text" placeholder="Add skill you teach..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
          <button type="submit" className="btn-green-sm">+ Add Skill</button>
        </form>
      </div>

      {}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title">Skills Wanted (What you want to learn)</h3>
        <div className="tags-row" style={{ margin: "10px 0" }}>
          {user.skillsWanted?.map((w) => (
            <span className="tag-pill" key={w}>
              {w} <button className="tag-close" onClick={() => removeWanted(w)}>×</button>
            </span>
          ))}
        </div>
        <form onSubmit={addWanted} className="add-tag-form">
          <input type="text" placeholder="Add skill you want to learn..." value={newWish} onChange={(e) => setNewWish(e.target.value)} />
          <button type="submit" className="btn-outline-sm">+ Add Wishlist</button>
        </form>
      </div>
    </div>
  );
}
