import React from "react";
import Icon from "./Icon";
import { useApp } from "../context";

// Yeh left side ka fixed sidebar menu component hai
export default function Sidebar() {
  const { activeTab, setActiveTab, requests, logout } = useApp();

  // Yeh pending requests ki ginti karta hai
  const pendingCount = requests.filter((r) => !r.to).length;

  // Yeh sidebar ke sare buttons ka data hai
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: "clipboard" },
    { id: "explore", label: "Explore Skills", icon: "compass" },
    { id: "requests", label: "My Requests", icon: "check", count: pendingCount },
    { id: "messages", label: "Messages", icon: "message" },
    { id: "points", label: "Skill Points", icon: "star" },
    { id: "reviews", label: "Reviews", icon: "award" },
    { id: "profile", label: "My Profile", icon: "user" }
  ];

  return (
    <aside className="sidebar-container">
      {/* Yeh website ka logo aur naam hai */}
      <div className="brand-box" onClick={() => setActiveTab("dashboard")}>
        <div className="brand-logo-icon">
          <Icon name="logo" size={20} color="#16a34a" />
        </div>
        <div>
          <h1 className="brand-name">Skill Swap</h1>
          <p className="brand-tagline">Exchange Skills, Not Money</p>
        </div>
      </div>

      {/* Yeh navigation buttons ki list hai */}
      <nav className="nav-list">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={"nav-button " + (activeTab === item.id ? "active" : "")}
          >
            <div className="nav-button-left">
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </div>
            {/* Agar pending request hai toh badge dikhaye */}
            {item.count > 0 && <span className="nav-badge">{item.count}</span>}
          </button>
        ))}
      </nav>

      {/* Yeh footer me logout button hai */}
      <div className="sidebar-bottom">
        <button className="logout-button" onClick={logout}>
          <Icon name="logout" size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
