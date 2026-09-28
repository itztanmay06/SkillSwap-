import React from 'react';
import Icon from './Icon';
import Avatar from './Avatar';
import { useApp } from '../context';

// Top Application Header Component
export default function Header({ title = "Welcome back, Tanmay!", subtitle = "Let's exchange skills and grow together." }) {
  const { user, searchQuery, setSearchQuery, setActiveTab } = useApp();

  return (
    <header className="page-header">
      {/* Title & Subtitle */}
      <div className="header-text">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-right">
        {/* Global Skill Search Bar */}
        <div className="header-search">
          <Icon name="search" size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('explore')}
          />
        </div>

        {/* Skill Points Quick Balance */}
        <button onClick={() => setActiveTab('points')} className="header-points-pill" title="My Skill Points Wallet">
          <Icon name="star" size={16} fill="#f59e0b" color="#f59e0b" />
          <span>{user.points} Points</span>
        </button>

        {/* User Profile Avatar */}
        <Avatar
          name={user.name}
          size="header"
          onClick={() => setActiveTab('profile')}
        />
      </div>
    </header>
  );
}
