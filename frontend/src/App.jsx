import React from 'react';
import { AppProvider, useApp } from './context';

// Layout and modal components
import Sidebar from './layout/Sidebar';
import { RequestModal, UserProfileModal } from './layout/Modals';

// Authentication component
import Auth from './components/Auth';

// Page view components
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Requests from './components/Requests';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Reviews from './components/Reviews';

// Global stylesheet
import './App.css';

function MainLayout() {
  const { activeTab, isLoggedIn } = useApp();

  // If user is not authenticated, render login/signup screen
  if (!isLoggedIn) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      {/* Navigation sidebar */}
      <Sidebar />

      {/* Main content routing container */}
      <main className="content-container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'requests' && <Requests />}
        {activeTab === 'points' && <Wallet />}
        {activeTab === 'reviews' && <Reviews />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'messages' && <Messages />}
      </main>

      {/* Skill exchange modal */}
      <RequestModal />
    </div>
  );
}

// Root application component with Context Provider wrapper
export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
