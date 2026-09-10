import React, { useState } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import { useApp } from "../context";

// Yeh user profile aur skills manage karne ka page component hai
export default function Profile() {
  const { user, setUser } = useApp();
  const [newSkill, setNewSkill] = useState("");
  const [newWish, setNewWish] = useState("");

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
        <div className="profile-header-row">
          <img src={user.avatar} alt={user.name} className="avatar-lg" />
          <div style={{ flex: 1 }}>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-title">{user.title}</p>
            <p className="text-muted text-sm">📍 {user.location || "Delhi, India"} • 📅 {user.joinedDate}</p>
          </div>
        </div>

        {/* Yeh 5 stats ki strip hai (Points, Rating, Completed, Teaching, Learning) */}
        <div className="stats-strip">
          <div><div className="strip-val">{user.points}</div><div className="strip-label">Skill Points</div></div>
          <div><div className="strip-val">⭐ {user.rating || "5.0"}</div><div className="strip-label">Rating</div></div>
          <div><div className="strip-val">{user.completed}</div><div className="strip-label">Completed</div></div>
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
