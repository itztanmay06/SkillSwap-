import React, { createContext, useContext, useState, useEffect } from 'react';

// Global React Application Context
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
    rating: 5.0,
    reviewsCount: 12,
    user: {
      name: 'Tanmay Mittal',
      title: 'Full Stack MERN Developer',
      avatar: '',
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
    rating: 4.9,
    reviewsCount: 15,
    user: {
      name: 'Vanshika Sharma',
      title: 'UI/UX Designer',
      avatar: '',
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
    rating: 4.8,
    reviewsCount: 9,
    user: {
      name: 'Rahul Verma',
      title: 'Musician & Guitarist',
      avatar: '',
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
    rating: 4.7,
    reviewsCount: 11,
    user: {
      name: 'Ayush Kumar',
      title: 'Marketing Specialist',
      avatar: '',
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
    title: 'Python & 24/7 Doubt Solving',
    category: 'Programming',
    description: 'Round-the-clock 24/7 live assistance for Python programming, debugging errors, and logic building.',
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

// Initial fallback user profile data
const defaultUser = {
  id: 'u1',
  name: 'Tanmay Mittal',
  email: 'tanmay@example.com',
  title: 'Full Stack MERN Developer & Student',
  avatar: '',
  location: 'Delhi, India',
  points: 200,                  // Initial signup points = 200
  activeRequests: 0,
  completed: 0,
  rating: 0,
  reviewCount: 0,               // 0 reviews by default
  skillsOffered: ['React.js & Modern Web Dev'],
  skillsWanted: ['UI/UX Design in Figma'],
  joinedDate: 'Sept 2026'
};

export function AppProvider({ children }) {
  // Authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // User profile state synced with localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillswap_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.email) parsed.email = 'tanmay@example.com';
      parsed.reviewCount = 0;   // Force 0 by default
      parsed.rating = 0;
      if (!parsed.joinedDate || parsed.joinedDate === 'January 2026' || parsed.joinedDate === 'September 2026') {
        parsed.joinedDate = 'Sept 2026';
      }
      return parsed;
    }
    return defaultUser;
  });

  // Navigation, catalog, and request states
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
        // Fallback to default skills if backend is offline
      });
  }, []);

  // Authenticate user session
  function login(email, newName) {
    if (newName) {
      setUser({ ...user, name: newName, email: email || user.email });
    }
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  }

  // End user session
  function logout() {
    setIsLoggedIn(false);
  }

  // Submit skill exchange request with point escrow deduction
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

  // Accept exchange request and credit points to provider
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

  // Reject exchange request and refund escrow points
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

// Custom hook for consuming application context
export function useApp() {
  return useContext(AppContext);
}
