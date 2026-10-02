import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

const defaultSkills = [
  { id: 's-2', title: 'UI/UX Design in Figma', category: 'Design', description: 'Master wireframing, color psychology, typography, and interactive prototyping.', pointsPerHour: 40, rating: 4.9, reviewsCount: 15, user: { name: 'Vanshika Sharma', location: 'Mumbai, India' } },
  { id: 's-3', title: 'Acoustic Guitar Basics', category: 'Music', description: 'Beginner chords, strumming patterns, and rhythm training.', pointsPerHour: 35, rating: 4.8, reviewsCount: 9, user: { name: 'Vanshika Jindal', location: 'Bangalore, India' } },
  { id: 's-4', title: 'SEO & Growth Marketing', category: 'Marketing', description: 'Keyword research, on-page optimization, and organic growth tracking.', pointsPerHour: 45, rating: 4.7, reviewsCount: 11, user: { name: 'Tanmay', location: 'Pune, India' } }
];

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

      if (parsed.points === undefined || parsed.points === null || parsed.points === 160) parsed.points = 200;
      if (parsed.activeRequests === undefined || parsed.activeRequests === null) parsed.activeRequests = 0;
      if (parsed.completed === undefined || parsed.completed === null) parsed.completed = 0;
      if (!parsed.joinedDate || parsed.joinedDate === 'January 2026') parsed.joinedDate = 'Sept 2026';
      return parsed;
    }
    return defaultUser;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState(defaultSkills);
  const [requests, setRequests] = useState(() => {
    const savedReqs = localStorage.getItem('skillswap_requests');
    if (savedReqs) {
      try {
        const parsed = JSON.parse(savedReqs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r) => (r.to === 'Vanshika Sharma' ? { ...r, to: 'Vanshika Jindal', skill: 'Acoustic Guitar Basics' } : r));
        }
      } catch (e) {}
    }
    return [
      { id: 'req-1', skill: 'Acoustic Guitar Basics', to: 'Vanshika Jindal', points: 35, hours: 1, status: 'pending', date: 'Today' }
    ];
  });
  const [activities, setActivities] = useState([
    { id: 'act-1', type: 'earned', title: 'You earned 200 points', subtitle: 'Default login coins credited to your wallet', time: 'Just now' }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 't-1', type: 'credit', title: 'Default Login Coins Credited', points: '+200', date: 'Just now' }
  ]);
  const [reviews, setReviews] = useState(() => [
    {
      id: 'rev-vj-2',
      author: 'Vanshika Sharma',
      rating: 5,
      skill: 'Acoustic Guitar Basics',
      date: '3 days ago',
      comment: 'Super fun lesson with Vanshika Jindal! Simplified difficult barre chords into easy beginner grips. Highly recommended!'
    }
  ]);
  const [requestModalSkill, setRequestModalSkill] = useState(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState({
    name: 'Vanshika Sharma', role: 'UI/UX Designer', avatar: '', online: true
  });

  useEffect(() => {
    localStorage.setItem('skillswap_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('skillswap_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    fetch(`${API_URL}/skills`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.skills?.length > 0) {
          const filteredLive = data.skills
            .filter((s) => s.user?.name !== 'Sofia Rodriguez' && s.user?.name !== 'Tanmay Mittal' && s.title !== 'React.js & Modern Web Dev')
            .map((s) => ({ ...s, id: s._id || s.id }));
          if (filteredLive.length > 0) setSkills(filteredLive);
        }
      })
      .catch(() => {});
  }, []);

  const login = (email, newName, initialSkill) => {
    if (newName) setUser((prev) => ({ ...prev, name: newName, email: email || prev.email }));
    if (initialSkill) {
      setSkills((prev) => [initialSkill, ...prev.filter((s) => s.id !== initialSkill.id)]);
      setActiveTab('explore');
    } else {
      setActiveTab('dashboard');
    }
    setIsLoggedIn(true);
  };

  const logout = () => setIsLoggedIn(false);

  const addSkill = (newSkillData) => {
    const card = {
      id: newSkillData.id || 's-' + Date.now(),
      title: newSkillData.title,
      category: newSkillData.category || 'Programming',
      description: newSkillData.description || `Learn ${newSkillData.title} with ${user.name}.`,
      pointsPerHour: newSkillData.pointsPerHour || 40,
      rating: 5.0,
      reviewsCount: 1,
      user: {
        name: user.name,
        title: user.title || 'Skill Explorer',
        avatar: user.avatar || '',
        rating: 5.0,
        location: user.location || 'India'
      }
    };
    setSkills((prev) => [card, ...prev.filter((s) => s.id !== card.id)]);
    fetch(`${API_URL}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    }).catch(() => {});
    return card;
  };

  const startChatWith = (peer) => {
    if (!peer) return;
    setActiveChatUser({ name: peer.name, role: peer.title || 'Skill Provider', avatar: peer.avatar || '', online: true });
    setActiveTab('messages');
  };

  const addReview = (reviewData = {}) => {
    const newRev = {
      id: 'rev-' + Date.now(),
      author: reviewData.author || 'Vanshika Sharma',
      rating: reviewData.rating || 5,
      skill: reviewData.skill || 'UI/UX Design in Figma',
      date: 'Just now',
      comment: reviewData.comment || 'Tanmay is a fantastic peer mentor! He solved all my doubts clearly and patiently.'
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    setUser({ ...user, reviewCount: updated.length, rating: 5.0 });
    return newRev;
  };

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
        searchQuery, setSearchQuery, skills, setSkills, addSkill, requests, setRequests,
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
