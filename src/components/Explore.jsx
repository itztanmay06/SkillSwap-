import React, { useState } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

// Yeh explore skills page component hai
export default function Explore() {
  const { skills, searchQuery, setSearchQuery, setRequestModalSkill, setSelectedUserForProfile } = useApp();
  const [category, setCategory] = useState("All");

  const categories = ["All", "Design", "Music", "Marketing", "Programming", "Languages"];

  // Yeh filter logic hai category aur search keyword ke hisaab se
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
      {/* Yeh top header bar hai */}
      <Header title="Explore Skills" subtitle="Discover and connect with people who can help you learn." />

      {/* Yeh category filter buttons hain (pills) */}
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

      {/* Yeh matching skills cards ka grid hai */}
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
              {/* Card Header (User Avatar aur Category) */}
              <div className="skill-card-header">
                <div className="skill-user-info" onClick={() => setSelectedUserForProfile(skill.user)}>
                  <Avatar name={skill.user.name} size="sm" />
                  <div>
                    <strong>{skill.user.name}</strong>
                    <span className="text-muted text-sm">{skill.user.title}</span>
                  </div>
                </div>
                <span className="tag-pill">{skill.category}</span>
              </div>

              {/* Card Title aur Description */}
              <h3 className="skill-title">{skill.title}</h3>
              <p className="skill-desc">{skill.description}</p>

              {/* Card Bottom (Rating aur Points Rate) */}
              <div className="skill-card-bottom">
                <div className="skill-rating">
                  <Icon name="star" size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>{skill.rating} ({skill.reviewsCount})</span>
                </div>
                <span className="rate-badge">{skill.pointsPerHour} pts/hr</span>
              </div>

              {/* Buttons (Request Exchange aur View Profile) */}
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
    </div>
  );
}
