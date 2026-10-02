import React from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

export default function Dashboard() {
  const { user, skills, requests, activities, setActiveTab, setSelectedUserForProfile } = useApp();
  const recommended = skills.slice(0, 3);

  const activeCount = requests && requests.length > 0
    ? requests.filter((r) => r.status === 'pending' || !r.status).length
    : (user.activeRequests ?? 0);

  return (
    <div className="page">
      {}
      <Header title={"Welcome back, " + user.name.split(" ")[0] + "!"} subtitle="Let's exchange skills and grow together." />

      {}
      <div className="stats-grid">

        {}
        <div className="stat-card green" onClick={() => setActiveTab("points")}>
          <div className="stat-icon-circle green">
            <Icon name="star" size={22} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div>
            <div className="stat-label">Skill Points</div>
            <div className="stat-value">{user.points ?? 200}</div>
            <div className="stat-subtext">Available Balance</div>
          </div>
        </div>

        {}
        <div className="stat-card amber" onClick={() => setActiveTab("requests")}>
          <div className="stat-icon-circle amber">
            <Icon name="clipboard" size={22} color="#d97706" />
          </div>
          <div>
            <div className="stat-label">Active Requests</div>
            <div className="stat-value">{activeCount}</div>
            <div className="stat-subtext text-amber">View all →</div>
          </div>
        </div>

        {}
        <div className="stat-card blue" onClick={() => setActiveTab("requests")}>
          <div className="stat-icon-circle blue">
            <Icon name="check" size={22} color="#2563eb" />
          </div>
          <div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{user.completed}</div>
            <div className="stat-subtext text-blue">View all →</div>
          </div>
        </div>

        {}
        <div className="stat-card purple" onClick={() => setActiveTab("reviews")}>
          <div className="stat-icon-circle purple">
            <Icon name="award" size={22} color="#9333ea" />
          </div>
          <div>
            <div className="stat-label">My Rating</div>
            <div className="stat-value">{user.reviewCount > 0 ? (Number(user.rating) || 0).toFixed(1) : (user.rating !== undefined && user.rating !== null ? Number(user.rating).toFixed(1) : "0.0")}</div>
            <div className="stat-subtext text-purple">View reviews →</div>
          </div>
        </div>

      </div>

      {}
      <div className="two-col-grid">

        {}
        <div className="panel">
          <div className="section-top">
            <h3 className="section-title">Recommended Skills for You</h3>
            <button className="btn-link" onClick={() => setActiveTab("explore")}>View all →</button>
          </div>

          <div className="recommended-list">
            {recommended.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#64748b" }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>No recommended skills right now.</p>
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Skills posted by peers will appear here.</p>
              </div>
            ) : (
              recommended.map((skill) => (
                <div className="skill-row" key={skill.id}>
                  <Avatar name={skill.user.name} size="sm" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700 }}>{skill.title}</h4>
                    <p className="text-muted" style={{ fontSize: 12 }}>{skill.user.name}</p>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="rate-badge">{skill.pointsPerHour} pts/hr</span>
                    <button className="btn-green-sm" onClick={() => setActiveTab("explore")}>Explore</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {}
        <div className="panel">
          <div className="section-top">
            <h3 className="section-title">Recent Activity</h3>
          </div>

          <div className="activity-list">
            {activities.map((act) => (
              <div className="activity-row" key={act.id}>
                <div className="activity-icon">
                  <Icon name="check" size={16} color="#16a34a" />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 13 }}>{act.title}</strong>
                  <p className="text-muted" style={{ fontSize: 11 }}>{act.subtitle}</p>
                </div>
                <span className="text-muted text-sm">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {}
      <div className="promo-banner">
        <div>
          <h3>Share your skills. Earn points. Learn new skills.</h3>
          <p>Be a part of a community that grows together without monetary fees.</p>
        </div>
        <button className="btn-white" onClick={() => setActiveTab("explore")}>Explore Skills</button>
      </div>
    </div>
  );
}
