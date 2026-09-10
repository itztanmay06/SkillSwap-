import React from 'react';
import { AppProvider, useApp } from './context';

// Yeh shared layout components hain (sidebar aur popups)
import Sidebar from './layout/Sidebar';
import { RequestModal, UserProfileModal } from './layout/Modals';

// Yeh login aur signup ka component hai
import Auth from './components/Auth';

// Yeh alag-alag tabs ke page components hain
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Requests from './components/Requests';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Reviews from './components/Reviews';

// Yeh puri website ki CSS styling file hai
import './App.css';

function MainLayout() {
  // Yeh pata karta hai ki user logged in hai ya nahi, aur kaunsa tab open hai
  const { activeTab, isLoggedIn } = useApp();

  // Agar user logged in nahi hai, toh seedha Login / Sign Up screen dikhaye
  if (!isLoggedIn) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      {/* Yeh left side ka navigation sidebar hai */}
      <Sidebar />

      {/* Yeh main screen area hai jahan clicked tab ka page dikhta hai */}
      <main className="content-container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'requests' && <Requests />}
        {activeTab === 'points' && <Wallet />}
        {activeTab === 'reviews' && <Reviews />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'messages' && <Messages />}
      </main>

      {/* Yeh pop-up modals hain jo button click karne pe khulte hain */}
      <RequestModal />
      <UserProfileModal />
    </div>
  );
}

// Yeh root component hai jo poore app ko context data provide karta hai
export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
