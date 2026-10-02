import React from 'react';
import { AppProvider, useApp } from './context';

import Sidebar from './layout/Sidebar';
import { RequestModal, UserProfileModal } from './layout/Modals';

import Auth from './components/Auth';

import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Requests from './components/Requests';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Reviews from './components/Reviews';

import './App.css';

function MainLayout() {
  const { activeTab, isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      {}
      <Sidebar />

      {}
      <main className="content-container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'requests' && <Requests />}
        {activeTab === 'points' && <Wallet />}
        {activeTab === 'reviews' && <Reviews />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'messages' && <Messages />}
      </main>

      {}
      <RequestModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
