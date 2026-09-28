import React, { createContext, useContext, useState, useEffect } from 'react';

// Yeh global data context create karta hai
const AppContext = createContext();

// Backend API URL (Express server running on port 5000)
const API_URL = 'http://localhost:5000/api';

// Initial default skills catalog
const defaultSkills = [
  {
    id: 's-1',
    title: 'React.js & Modern Web Dev',
    category: 'Programming',
    description: 'Learn modern React hooks, component architecture, state management, and Vite build setups.',
    pointsPerHour: 50,
    user: {
      name: 'Tanmay Mittal',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      location: 'Delhi, India'
    }
  },
  {
    id: 's-2',
    title: 'UI/UX Design in Figma',
    category: 'Design',
    description: 'Master wireframing, color psychology, typography, and interactive prototyping.',
    pointsPerHour: 40,
    user: {
      name: 'Vanshika Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      location: 'Mumbai, India'
    }
  },
  {
    id: 's-3',
    title: 'Acoustic Guitar Basics',
    category: 'Music',
    description: 'Beginner friendly chords, strumming patterns, and rhythm training for beginners.',
    pointsPerHour: 35,
    user: {
      name: 'Vanshika Jindal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      location: 'Bangalore, India'
    }
  },
  {
    id: 's-4',
    title: 'SEO & Growth Marketing',
    category: 'Marketing',
    description: 'Keyword research, on-page optimization, content strategy, and organic growth tracking.',
    pointsPerHour: 45,
    user: {
      name: 'Ayush Kumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      location: 'Pune, India'
    }
  },
  {
    id: 's-5',
    title: 'Conversational Spanish',
    category: 'Languages',
    description: 'Pronunciation, daily vocabulary, grammar essentials, and real conversational practice.',
    pointsPerHour: 30,
    rating: 4.9,
    reviewsCount: 16,
    user: {
      name: 'Sofia Rodriguez',
      title: 'Language Instructor',
      avatar: '',
      rating: 4.9,
      location: 'Madrid, Spain'
    }
  },
  {
    id: 's-6',
    title: '24/7 Available',
    category: 'Programming',
    description: 'Call me any time for 24/7 fn',
    pointsPerHour: 35,
    availability: '24/7 Available',
    rating: 5.0,
    reviewsCount: 24,
    user: {
      name: 'Ananya Sharma',
      title: 'CS Student • 24/7 Doubt Solver',
      avatar: '',
      rating: 5.0,
      location: 'Chandigarh, India'
    }
  }
];

// Yeh Tanmay Mittal ka initial user profile data hai
const defaultUser = {
  id: 'u1',
  name: 'Tanmay Mittal',
  email: 'tanmay@example.com',
  title: 'Full Stack MERN Developer & Student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  location: 'Delhi, India',
  points: 200,                  // Default login coins = 200
  activeRequests: 0,
  completed: 0,
  rating: 0,
  reviewCount: 0,               // 0 reviews by default
  skillsOffered: ['React.js & Modern Web Dev'],
  skillsWanted: ['UI/UX Design in Figma'],
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
      if (!parsed.email) parsed.email = 'tanmay@example.com';
      parsed.reviewCount = 0;   // Force 0 by default
      parsed.rating = 0;
      parsed.completed = 0;     // Force 0 Completed by default
      return parsed;
    }
    return defaultUser;
  });

  // Yeh alag-alag states hain tabs, search, aur lists ke liye
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState(defaultSkills);
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

  // Active chat recipient for direct messaging
  const [activeChatUser, setActiveChatUser] = useState({
    name: 'Ananya Sharma',
    role: 'CS Student • 24/7 Doubt Solver',
    avatar: '',
    online: true
  });

  // Switch to messages and initiate chat with specific peer
  function startChatWith(peer) {
    if (!peer) return;
    setActiveChatUser({
      name: peer.name,
      role: peer.title || 'Skill Provider',
      avatar: peer.avatar || '',
      online: true
    });
    setActiveTab('messages');
  }

  // Add peer review / feedback
  function addReview(reviewData = {}) {
    const newRev = {
      id: 'rev-' + Date.now(),
      author: reviewData.author || 'Ananya Sharma',
      rating: reviewData.rating || 5,
      skill: reviewData.skill || 'Python & 24/7 Doubt Solving',
      date: 'Just now',
      comment: reviewData.comment || 'Tanmay is a fantastic peer mentor! He solved all my doubts clearly and patiently.'
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    setUser({
      ...user,
      reviewCount: updated.length,
      rating: 5.0
    });
    return newRev;
  }

  // 1. Sync User data with LocalStorage
  useEffect(() => {
    localStorage.setItem('skillswap_user', JSON.stringify(user));
  }, [user]);

  // 2. Fetch Skills from Backend API on mount
  useEffect(() => {
    fetch(`${API_URL}/skills`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.skills && data.skills.length > 0) {
          const formatted = data.skills.map((s) => ({
            ...s,
            id: s._id || s.id
          }));
          setSkills(formatted);
        }
      })
      .catch(() => {
        // Backend offline ho toh local defaultSkills automatically use hongi
      });
  }, []);

  // Yeh login function hai jo account open karta hai
  function login(email, newName) {
    if (newName) {
      setUser({ ...user, name: newName, email: email || user.email });
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

    // Call Backend API to save request & update database
    fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillTitle: skill.title,
        requesterName: user.name,
        toUserName: skill.user.name,
        avatar: skill.user.avatar,
        hours: hours,
        points: cost,
        note: note,
        userEmail: user.email
      })
    }).catch(() => {});

    alert('Request sent! ' + cost + ' points reserved.');
    return true;
  }

  // Yeh function request accept karke user ko points credit karta hai
  function acceptRequest(requestId) {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r)));
    setUser({
      ...user,
      points: user.points + req.points,
      activeRequests: Math.max(0, user.activeRequests - 1),
      completed: user.completed + 1
    });

    // Call Backend API to accept request
    fetch(`${API_URL}/requests/${requestId}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverEmail: user.email })
    }).catch(() => {});

    alert('Request accepted! +' + req.points + ' points credited.');
  }

  // Yeh function request reject karta hai
  function rejectRequest(requestId) {
    setRequests(requests.filter((r) => r.id !== requestId));
    setUser({ ...user, activeRequests: Math.max(0, user.activeRequests - 1) });

    // Call Backend API to reject request
    fetch(`${API_URL}/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterEmail: user.email })
    }).catch(() => {});

    alert('Request declined.');
  }

  return (
    <AppContext.Provider
      value={{
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
        setReviews,
        addReview,
        activeChatUser,
        setActiveChatUser,
        startChatWith,
        requestModalSkill,
        setRequestModalSkill,
        selectedUserForProfile,
        setSelectedUserForProfile,
        sendRequest,
        acceptRequest,
        rejectRequest
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Yeh custom hook hai context ko easy use karne ke liye
export function useApp() {
  return useContext(AppContext);
}
