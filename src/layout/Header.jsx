import React from 'react';
import Icon from './Icon';
import { useApp } from '../context';

// Yeh top bar ka header component hai
export default function Header({ title = "Welcome back, Tanmay!", subtitle = "Let's exchange skills and grow together." }) {
  const { user, searchQuery, setSearchQuery, setActiveTab } = useApp();

  return (
    <header className="page-header">
      {/* Yeh page ka main title aur subtitle hai */}
      <div className="header-text">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-right">
        {/* Yeh search bar hai skills khojne ke liye */}
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

        {/* Yeh points wallet ka button hai jo total coins dikhata hai */}
        <button onClick={() => setActiveTab('points')} className="header-points-pill" title="My Skill Points Wallet">
          <Icon name="star" size={16} fill="#f59e0b" color="#f59e0b" />
          <span>{user.points} Points</span>
        </button>

        {/* Yeh user ki profile photo hai jisse profile page khulta hai */}
        <img
          src={user.avatar}
          alt={user.name}
          onClick={() => setActiveTab('profile')}
          className="header-user-avatar"
          title="View Profile"
        />
      </div>
    </header>
  );
}
