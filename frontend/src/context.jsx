import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

// Initial fallback skills catalog
const defaultSkills = [
  { id: 's-1', title: 'React.js & Modern Web Dev', category: 'Programming', description: 'Learn modern React hooks, state management, and Vite build setups.', pointsPerHour: 50, rating: 5.0, reviewsCount: 12, user: { name: 'Tanmay Mittal', title: 'Full Stack MERN Developer', location: 'Delhi, India' } },
  { id: 's-2', title: 'UI/UX Design in Figma', category: 'Design', description: 'Master wireframing, color psychology, typography, and interactive prototyping.', pointsPerHour: 40, rating: 4.9, reviewsCount: 15, user: { name: 'Vanshika Sharma', title: 'UI/UX Designer', location: 'Mumbai, India' } },
  { id: 's-3', title: 'Acoustic Guitar Basics', category: 'Music', description: 'Beginner chords, strumming patterns, and rhythm training.', pointsPerHour: 35, rating: 4.8, reviewsCount: 9, user: { name: 'Rahul Verma', title: 'Musician & Guitarist', location: 'Bangalore, India' } },
  { id: 's-4', title: 'SEO & Growth Marketing', category: 'Marketing', description: 'Keyword research, on-page optimization, and organic growth tracking.', pointsPerHour: 45, rating: 4.7, reviewsCount: 11, user: { name: 'Ayush Kumar', title: 'Marketing Specialist', location: 'Pune, India' } },
  { id: 's-5', title: 'Conversational Spanish', category: 'Languages', description: 'Pronunciation, daily vocabulary, and real conversational practice.', pointsPerHour: 30, rating: 4.9, reviewsCount: 16, user: { name: 'Sofia Rodriguez', title: 'Language Instructor', location: 'Madrid, Spain' } },
  { id: 's-6', title: 'Python & 24/7 Doubt Solving', category: 'Programming', description: 'Round-the-clock 24/7 live assistance for Python programming and debugging.', pointsPerHour: 35, availability: '24/7 Available', rating: 5.0, reviewsCount: 24, user: { name: 'Ananya Sharma', title: 'CS Student • 24/7 Doubt Solver', location: 'Chandigarh, India' } }
];

// Initial default user profile
const defaultUser = {
  id: 'u1', name: 'Tanmay Mittal', email: 'tanmay@example.com',
  title: 'Full Stack MERN Developer & Student', location: 'Delhi, India',
  points: 200, activeRequests: 0, completed: 0, rating: 0, reviewCount: 0,
  skillsOffered: ['React.js & Modern Web Dev'], skillsWanted: ['UI/UX Design in Figma'],
  joinedDate: 'Sept 2026'
};

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillswap_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.email) parsed.email = 'tanmay@example.com';
      parsed.reviewCount = 0;
      parsed.rating = 0;
      if (!parsed.joinedDate || parsed.joinedDate === 'January 2026') parsed.joinedDate = 'Sept 2026';
      return parsed;
    }
    return defaultUser;
  });

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
  const [activeChatUser, setActiveChatUser] = useState({
    name: 'Ananya Sharma', role: 'CS Student • 24/7 Doubt Solver', avatar: '', online: true
  });

  // Sync user state with localStorage
  useEffect(() => {
    localStorage.setItem('skillswap_user', JSON.stringify(user));
  }, [user]);

  // Fetch live skills from backend API
  useEffect(() => {
    fetch(`${API_URL}/skills`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.skills?.length > 0) {
          setSkills(data.skills.map((s) => ({ ...s, id: s._id || s.id })));
        }
      })
      .catch(() => {});
  }, []);

  const login = (email, newName) => {
    if (newName) setUser({ ...user, name: newName, email: email || user.email });
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const logout = () => setIsLoggedIn(false);

  const startChatWith = (peer) => {
    if (!peer) return;
    setActiveChatUser({ name: peer.name, role: peer.title || 'Skill Provider', avatar: peer.avatar || '', online: true });
    setActiveTab('messages');
  };

  const addReview = (reviewData = {}) => {
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
    setUser({ ...user, reviewCount: updated.length, rating: 5.0 });
    return newRev;
  };

  // Submit skill exchange request with point escrow deduction
  const sendRequest = (skill, hours, note) => {
    const cost = skill.pointsPerHour * hours;
    if (user.points < cost) return alert(`Not enough Skill Points! You need ${cost} points.`);

    const newReq = {
      id: 'req-' + Date.now(), skill: skill.title, to: skill.user.name,
      avatar: skill.user.avatar, points: cost, hours, note, status: 'pending', date: 'Just now'
    };
    setRequests([newReq, ...requests]);
    setUser({ ...user, points: user.points - cost, activeRequests: user.activeRequests + 1 });
    setRequestModalSkill(null);

    fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillTitle: skill.title, requesterName: user.name, toUserName: skill.user.name,
        avatar: skill.user.avatar, hours, points: cost, note, userEmail: user.email
      })
    }).catch(() => {});
    alert(`Request sent! ${cost} points reserved.`);
  };

  // Accept exchange request and credit points to provider
  const acceptRequest = (requestId) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r)));
    setUser({ ...user, points: user.points + req.points, activeRequests: Math.max(0, user.activeRequests - 1), completed: user.completed + 1 });

    fetch(`${API_URL}/requests/${requestId}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverEmail: user.email })
    }).catch(() => {});
    alert(`Request accepted! +${req.points} points credited.`);
  };

  // Reject exchange request and refund points
  const rejectRequest = (requestId) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    setUser({ ...user, activeRequests: Math.max(0, user.activeRequests - 1) });

    fetch(`${API_URL}/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterEmail: user.email })
    }).catch(() => {});
    alert('Request declined.');
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn, login, logout, user, setUser, activeTab, setActiveTab,
        searchQuery, setSearchQuery, skills, setSkills, requests, setRequests,
        activities, setActivities, transactions, reviews, setReviews, addReview,
        activeChatUser, setActiveChatUser, startChatWith, requestModalSkill,
        setRequestModalSkill, selectedUserForProfile, setSelectedUserForProfile,
        sendRequest, acceptRequest, rejectRequest
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
