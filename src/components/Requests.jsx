import React, { useState } from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

// Yeh exchange requests dekhne aur accept/reject karne ka page hai
export default function Requests() {
  const { requests, acceptRequest, rejectRequest } = useApp();
  const [tab, setTab] = useState("received");

  // Received aur Sent requests ko alag alag filter kiya
  const received = requests.filter((r) => !r.to);
  const sent = requests.filter((r) => r.to);

  return (
    <div className="page">
      {/* Yeh top header bar hai */}
      <Header title="My Requests" subtitle="Manage incoming skill exchange requests and view sent applications." />

      {/* Yeh Received aur Sent switch karne ke tabs hain */}
      <div className="tab-nav">
        <button className={"tab-btn " + (tab === "received" ? "active" : "")} onClick={() => setTab("received")}>
          Received Requests ({received.length})
        </button>
        <button className={"tab-btn " + (tab === "sent" ? "active" : "")} onClick={() => setTab("sent")}>
          Sent Requests ({sent.length})
        </button>
      </div>

      {/* Yeh Received requests ka list view hai */}
      {tab === "received" && (
        <div className="panel">
          {received.length === 0 ? (
            <p className="text-muted" style={{ padding: 16 }}>No pending received requests.</p>
          ) : (
            received.map((req) => (
              <div className="request-card-row" key={req.id}>
                <Avatar name={req.from || req.requesterName || "Peer"} size="md" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>Request for {req.skill}</h4>
                  <p className="text-muted text-sm">from <strong>{req.from}</strong> • {req.date}</p>
                  <span className="rate-badge" style={{ marginTop: 4, display: 'inline-block' }}>{req.points} pts / hr</span>
                </div>
                {/* Accept aur Reject buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-green-sm" onClick={() => acceptRequest(req.id)}>Accept</button>
                  <button className="btn-danger-sm" onClick={() => rejectRequest(req.id)}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Yeh Sent requests ka list view hai */}
      {tab === "sent" && (
        <div className="panel">
          {sent.length === 0 ? (
            <p className="text-muted" style={{ padding: 16 }}>You have not sent any requests yet.</p>
          ) : (
            sent.map((req) => (
              <div className="request-card-row" key={req.id}>
                <Avatar name={req.to || req.toUserName || "Peer"} size="md" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>Request for {req.skill}</h4>
                  <p className="text-muted text-sm">to <strong>{req.to}</strong> • {req.date}</p>
                </div>
                <span className="tag-pill green">{req.status === "accepted" ? "Accepted" : "Pending"}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
