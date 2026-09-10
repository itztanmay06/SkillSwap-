import React, { useState } from 'react';
import { X, AlertCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../context';

// 1. Request Modal
export function RequestModal() {
  const { requestModalSkill, setRequestModalSkill, user, sendRequest } = useApp();
  const [hours, setHours] = useState(1);
  const [message, setMessage] = useState('');

  if (!requestModalSkill) return null;

  const totalPoints = requestModalSkill.pointsPerHour * hours;
  const hasEnoughPoints = user.points >= totalPoints;

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!hasEnoughPoints) {
      alert('You need ' + totalPoints + ' points, but you have ' + user.points + ' points.');
      return;
    }
    sendRequest(requestModalSkill, hours, message);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Request Skill Exchange</h3>
            <p className="modal-subtitle">Propose a barter exchange with {requestModalSkill.user.name}</p>
          </div>
          <button onClick={() => setRequestModalSkill(null)} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-skill-summary">
          <img src={requestModalSkill.user.avatar} alt={requestModalSkill.user.name} className="modal-skill-avatar" />
          <div className="modal-skill-details">
            <h4 className="modal-skill-name">{requestModalSkill.title}</h4>
            <p className="modal-provider-name">By {requestModalSkill.user.name}</p>
            <span className="modal-skill-rate">{requestModalSkill.pointsPerHour} pts / hour</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Session Duration (Hours)</label>
            <div className="hours-selector-row">
              {[1, 2, 3, 4].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setHours(h)}
                  className={'hour-btn ' + (hours === h ? 'hour-btn-selected' : '')}
                >
                  {h} Hour{h > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="points-summary-box">
            <div className="summary-row">
              <span>Rate:</span>
              <span>{requestModalSkill.pointsPerHour} pts × {hours} hour(s)</span>
            </div>
            <div className="summary-row total-row">
              <strong>Total Points Required:</strong>
              <strong style={{ color: "#16a34a" }}>{totalPoints} Skill Points</strong>
            </div>
            <div className="summary-row balance-row">
              <span>Your Current Balance:</span>
              <span style={{ color: hasEnoughPoints ? '#334155' : '#dc2626' }}>
                {user.points} pts
              </span>
            </div>
          </div>

          {!hasEnoughPoints && (
            <div className="insufficient-alert">
              <AlertCircle size={16} />
              <span>Insufficient points! You need {totalPoints} points.</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Note for {requestModalSkill.user.name.split(' ')[0]}</label>
            <textarea
              rows={3}
              placeholder="What specifically would you like to learn?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="modal-textarea"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => setRequestModalSkill(null)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={!hasEnoughPoints} className="btn-green">
              Send Request ({totalPoints} pts)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. User Profile Modal
export function UserProfileModal() {
  const { selectedUserForProfile, setSelectedUserForProfile, skills, setRequestModalSkill, setActiveTab } = useApp();

  if (!selectedUserForProfile) return null;

  const userSkills = skills.filter((s) => s.user.name === selectedUserForProfile.name);

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-profile-card">
        <div className="modal-header">
          <h3 className="modal-title">Peer Profile</h3>
          <button onClick={() => setSelectedUserForProfile(null)} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="user-modal-hero">
          <img src={selectedUserForProfile.avatar} alt={selectedUserForProfile.name} className="user-modal-avatar" />
          <div className="user-modal-info">
            <h2 className="user-modal-name">{selectedUserForProfile.name}</h2>
            <p className="user-modal-role">{selectedUserForProfile.title || 'Skill Provider'}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={() => {
              setSelectedUserForProfile(null);
              setActiveTab('messages');
            }}
            className="btn-green"
          >
            <MessageSquare size={16} /> Message
          </button>
          <button type="button" onClick={() => setSelectedUserForProfile(null)} className="btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
