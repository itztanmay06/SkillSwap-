import React, { createContext, useContext, useState, useEffect } from 'react';

// Yeh global data context create karta hai
const AppContext = createContext();

// Yeh Tanmay Mittal ka initial user profile data hai
const defaultUser = {
  id: 'u1',
  name: 'Tanmay Mittal',
  title: 'Full Stack MERN Developer & Student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  location: 'Delhi, India',
  points: 200,                  // Default login coins = 200
  activeRequests: 0,
  completed: 0,
  rating: 5.0,
  reviewCount: 5,
  skillsOffered: [],            // Teaching = 0
  skillsWanted: [],             // Learning = 0
  joinedDate: 'January 2026'
};

export function AppProvider({ children }) {
  // Yeh check karta hai ki user logged in hai ya nahi
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Yeh user ka main state hai jo localStorage se load aur sync hota hai
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillswap_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.points = 200;
      parsed.rating = 5.0;
      parsed.reviewCount = 5;
      parsed.skillsOffered = [];
      parsed.skillsWanted = [];
      localStorage.setItem('skillswap_user', JSON.stringify(parsed));
      return parsed;
    }
    return defaultUser;
  });

  // Yeh alag-alag states hain tabs, search, aur lists ke liye
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activities, setActivities] = useState([
    { id: 'act-1', type: 'earned', title: 'You earned 200 points', subtitle: 'Default login coins credited to your wallet', time: 'Just now' }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 't-1', type: 'credit', title: 'Default Login Coins Credited', points: '+200', date: 'Just now' }
  ]);
  const [reviews, setReviews] = useState([]);
  const [requestModalSkill, setRequestModalSkill] = useState(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  // Yeh user data ko automatically browser me save karta hai
  useEffect(() => {
    localStorage.setItem('skillswap_user', JSON.stringify(user));
  }, [user]);

  // Yeh login function hai jo account open karta hai
  function login(email, newName) {
    if (newName) {
      setUser({ ...user, name: newName });
    }
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  }

  // Yeh logout function hai jo user ko login screen par bhejta hai
  function logout() {
    setIsLoggedIn(false);
  }

  // Yeh function exchange request bhejta hai aur points deduct karta hai
  function sendRequest(skill, hours, note) {
    const cost = skill.pointsPerHour * hours;
    if (user.points < cost) {
      alert('Not enough Skill Points! You need ' + cost + ' points.');
      return false;
    }

    const newReq = {
      id: 'req-' + Date.now(),
      skill: skill.title,
      to: skill.user.name,
      avatar: skill.user.avatar,
      points: cost,
      hours: hours,
      note: note,
      status: 'pending',
      date: 'Just now'
    };

    setRequests([newReq, ...requests]);
    setUser({ ...user, points: user.points - cost, activeRequests: user.activeRequests + 1 });
    setRequestModalSkill(null);
    alert('Request sent! ' + cost + ' points reserved.');
    return true;
  }

  // Yeh function request accept karke user ko points credit karta hai
  function acceptRequest(requestId) {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));
    setUser({
      ...user,
      points: user.points + req.points,
      activeRequests: Math.max(0, user.activeRequests - 1),
      completed: user.completed + 1
    });

    alert('Request accepted! +' + req.points + ' points credited.');
  }

  // Yeh function request reject karta hai
  function rejectRequest(requestId) {
    setRequests(requests.filter(r => r.id !== requestId));
    setUser({ ...user, activeRequests: Math.max(0, user.activeRequests - 1) });
    alert('Request declined.');
  }

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      user,
      setUser,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      skills,
      setSkills,
      requests,
      setRequests,
      activities,
      setActivities,
      transactions,
      reviews,
      requestModalSkill,
      setRequestModalSkill,
      selectedUserForProfile,
      setSelectedUserForProfile,
      sendRequest,
      acceptRequest,
      rejectRequest
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Yeh custom hook hai context ko easy use karne ke liye
export function useApp() {
  return useContext(AppContext);
}
