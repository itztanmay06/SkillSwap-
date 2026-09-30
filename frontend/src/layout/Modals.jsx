import React, { useState } from 'react';
import { X, AlertCircle, MessageSquare } from 'lucide-react';
import Avatar from './Avatar';
import { useApp } from '../context';

export function RequestModal() {
  const { requestModalSkill, setRequestModalSkill, user, sendRequest } = useApp();
  const [hours, setHours] = useState(1);
  const [message, setMessage] = useState('');

  if (!requestModalSkill) return null;
  const totalPoints = requestModalSkill.pointsPerHour * hours;
  const hasEnoughPoints = user.points >= totalPoints;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasEnoughPoints) return alert(`You need ${totalPoints} points, but only have ${user.points} points.`);
    sendRequest(requestModalSkill, hours, message);
  };

  return (
    <div className="modal-backdrop" onClick={() => setRequestModalSkill(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Request Skill Exchange</h3>
            <p className="modal-subtitle">Propose a barter exchange with {requestModalSkill.user.name}</p>
          </div>
          <button onClick={() => setRequestModalSkill(null)} className="modal-close-btn"><X size={20} /></button>
        </div>

        <div className="modal-skill-summary">
          <Avatar name={requestModalSkill.user.name} size="md" />
          <div className="modal-skill-details">
            <h4 className="modal-skill-name">{requestModalSkill.title}</h4>
            <p className="modal-provider-name">By {requestModalSkill.user.name}</p>
            <span className="modal-skill-rate">{requestModalSkill.pointsPerHour} pts / hour</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Session Duration (Hours)</label>
            <div className="hours-selector-row">
              {[1, 2, 3, 4].map((h) => (
                <button type="button" key={h} onClick={() => setHours(h)} className={'hour-btn ' + (hours === h ? 'hour-btn-selected' : '')}>
                  {h} Hour{h > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="points-summary-box">
            <div className="summary-row"><span>Rate:</span><span>{requestModalSkill.pointsPerHour} pts × {hours} hr</span></div>
            <div className="summary-row total-row"><strong>Total Required:</strong><strong style={{ color: "#16a34a" }}>{totalPoints} pts</strong></div>
            <div className="summary-row balance-row"><span>Your Balance:</span><span style={{ color: hasEnoughPoints ? '#334155' : '#dc2626' }}>{user.points} pts</span></div>
          </div>

          {!hasEnoughPoints && (
            <div className="insufficient-alert"><AlertCircle size={16} /><span>Insufficient points! You need {totalPoints} pts.</span></div>
          )}

          <div className="form-group">
            <label className="form-label">Note for {requestModalSkill.user.name.split(' ')[0]}</label>
            <textarea rows={3} placeholder="What specifically would you like to learn?" value={message} onChange={(e) => setMessage(e.target.value)} className="modal-textarea" />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => setRequestModalSkill(null)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={!hasEnoughPoints} className="btn-green">Send Request ({totalPoints} pts)</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UserProfileModal() {
  const { selectedUserForProfile, setSelectedUserForProfile, skills, setRequestModalSkill, startChatWith, activeTab } = useApp();
  if (!selectedUserForProfile || activeTab !== 'explore') return null;

  const userSkills = skills.filter((s) => s.user?.name?.toLowerCase() === selectedUserForProfile.name.toLowerCase());
  const primarySkill = userSkills[0];

  return (
    <div className="modal-backdrop" onClick={() => setSelectedUserForProfile(null)}>
      <div className="modal-card modal-peer-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><h3 className="modal-title">Peer Mentor Profile</h3><p className="modal-subtitle">SkillSwap Community Member</p></div>
          <button onClick={() => setSelectedUserForProfile(null)} className="modal-close-btn"><X size={20} /></button>
        </div>

        <div className="peer-profile-hero">
          <Avatar name={selectedUserForProfile.name} size="lg" />
          <div className="peer-hero-details">
            <h2 className="peer-hero-name">{selectedUserForProfile.name}</h2>
            <div className="peer-badges-row">
              <span className="peer-badge rating-badge">⭐ {selectedUserForProfile.rating || 5.0} Rating</span>
              <span className="peer-badge">📍 {selectedUserForProfile.location || 'India'}</span>
              <span className="peer-badge">📅 Joined Sept 2026</span>
              {(selectedUserForProfile.availability || primarySkill?.availability) && (
                <span className="tag-pill green" style={{ fontSize: 11, fontWeight: 700 }}>⚡ {selectedUserForProfile.availability || primarySkill?.availability}</span>
              )}
            </div>
          </div>
        </div>

        <div className="peer-skills-section">
          <h4 className="peer-section-heading">Skills Offered for Swap:</h4>
          <div className="peer-skills-list">
            {userSkills.map((s) => (
              <div key={s.id} className="peer-skill-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><strong style={{ fontSize: 14 }}>{s.title}</strong><span className="tag-pill">{s.category}</span></div>
                  <p className="text-muted text-sm" style={{ marginTop: 4 }}>{s.description}</p>
                </div>
                <span className="rate-badge">{s.pointsPerHour} pts/hr</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 20 }}>
          <button type="button" onClick={() => { const peer = { ...selectedUserForProfile }; setSelectedUserForProfile(null); startChatWith(peer); }} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <MessageSquare size={16} /> Message {selectedUserForProfile.name.split(' ')[0]}
          </button>
          {primarySkill && (
            <button type="button" onClick={() => { const s = primarySkill; setSelectedUserForProfile(null); setRequestModalSkill(s); }} className="btn-green">
              Request Exchange
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
