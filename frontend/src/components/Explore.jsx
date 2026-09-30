import React, { useState } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { UserProfileModal } from "../layout/Modals";
import { useApp } from "../context";

// Explore Skills Catalog Component
export default function Explore() {
  const { skills, searchQuery, setSearchQuery, setRequestModalSkill, setSelectedUserForProfile } = useApp();
  const [category, setCategory] = useState("All");

  const categories = ["All", "Design", "Music", "Marketing", "Programming", "Languages"];

  // Filter skills by selected category and search keyword
  const filtered = skills.filter((s) => {
    const matchCat = category === "All" || s.category.toLowerCase() === category.toLowerCase();
    const search = searchQuery.toLowerCase();
    const matchSearch = s.title.toLowerCase().includes(search) || 
                        s.description.toLowerCase().includes(search) || 
                        s.user.name.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="page">
      {/* Page Header */}
      <Header title="Explore Skills" subtitle="Discover and connect with people who can help you learn." />

      {/* Category Filter Pills */}
      <div className="filter-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={"category-pill " + (category === cat ? "active" : "")}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {filtered.length === 0 ? (
        <div className="panel empty-box">
          <p>No skills found in this category.</p>
          <button className="btn-green-sm" onClick={() => { setCategory("All"); setSearchQuery(""); }}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="skills-grid">
          {filtered.map((skill) => (
            <div className="skill-card-box" key={skill.id}>
              {/* Card Header (User Avatar and Category) */}
              <div className="skill-card-header">
                <div className="skill-user-info" onClick={() => setSelectedUserForProfile(skill.user)}>
                  <Avatar name={skill.user.name} size="sm" />
                  <div>
                    <strong>{skill.user.name}</strong>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {skill.availability && (
                    <span className="tag-pill green" style={{ fontSize: "11px", fontWeight: "700" }}>
                      ⚡ {skill.availability}
                    </span>
                  )}
                  <span className="tag-pill">{skill.category}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="skill-title">{skill.title}</h3>
              <p className="skill-desc">{skill.description}</p>

              {/* Rating and Points Rate */}
              <div className="skill-card-bottom">
                <div className="skill-rating">
                  <Icon name="star" size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>{skill.rating || skill.user?.rating || 4.9} ({skill.reviewsCount || 12})</span>
                </div>
                <span className="rate-badge">{skill.pointsPerHour} pts/hr</span>
              </div>

              {/* Action Buttons */}
              <div className="skill-actions-row">
                <button className="btn-green" onClick={() => setRequestModalSkill(skill)}>
                  Request Exchange
                </button>
                <button className="btn-outline" onClick={() => setSelectedUserForProfile(skill.user)}>
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Peer Profile Modal (Scoped exclusively inside Explore Skills) */}
      <UserProfileModal />
    </div>
  );
}
