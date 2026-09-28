import React from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import { useApp } from "../context";

// Skill Points Wallet and Transaction History Component
export default function Wallet() {
  const { user, transactions, setActiveTab } = useApp();

  return (
    <div className="page">
      {/* Page Header */}
      <Header title="Skill Points Wallet" subtitle="Track your earned and spent points in the credit-based exchange economy." />

      {/* Balance Summary Card */}
      <div className="panel wallet-hero-panel">
        <div>
          <span className="wallet-label">Available Skill Points</span>
          <h2 className="wallet-balance">{user.points} <span style={{ fontSize: 20 }}>pts</span></h2>
          <p className="text-muted text-sm">Earn 15-30 points for every hour you teach a skill.</p>
        </div>
        <button className="btn-green" onClick={() => setActiveTab("explore")}>
          Explore Skills to Learn
        </button>
      </div>

      {/* Transaction Ledger History */}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 16 }}>Points Transaction History</h3>
        
        <div className="transactions-list">
          {transactions.map((t) => (
            <div className="transaction-row" key={t.id}>
              <div className="transaction-icon">
                <Icon name="star" size={18} fill="#f59e0b" color="#f59e0b" />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{t.title}</strong>
                <p className="text-muted text-sm">{t.date}</p>
              </div>
              <span className="rate-badge" style={{ fontSize: 13 }}>{t.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
