import React from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import { useApp } from "../context";

// Yeh rating breakdown ka percentage data hai
const ratingBreakdown = [
  { stars: "5 Stars", percent: 100 },
  { stars: "4 Stars", percent: 0 },
  { stars: "3 Stars", percent: 0 },
  { stars: "2 Stars", percent: 0 },
  { stars: "1 Star", percent: 0 }
];

// Yeh community ratings aur reviews ka page component hai
export default function Reviews() {
  const { user, reviews } = useApp();

  return (
    <div className="page">
      {/* Yeh top header bar hai */}
      <Header title="Community Ratings & Reviews" subtitle="Feedback and trust ratings earned through completed skill exchanges." />

      <div className="section-top">
        <div>
          <h2 className="section-title">Rating Summary</h2>
          <p className="section-subtitle">Based on peer reviews from your skill sessions.</p>
        </div>
      </div>

      {/* Yeh overall rating score aur star breakdown panel hai */}
      <div className="panel reviews-panel">
        <div className="reviews-score">
          <div className="reviews-big-number">{user.rating || "5.0"}</div>
          <div className="reviews-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <Icon name="star" size={18} fill="#f59e0b" color="#f59e0b" key={n} />
            ))}
          </div>
          <div className="reviews-count">Based on {user.reviewCount || 5} completed exchanges</div>
        </div>

        {/* Yeh rating progress bars hain (5 star, 4 star, etc.) */}
        <div className="reviews-bars">
          {ratingBreakdown.map((row) => (
            <div className="rating-row" key={row.stars}>
              <span className="rating-label">{row.stars}</span>
              <div className="rating-track">
                <div className="rating-fill" style={{ width: row.percent + "%" }}></div>
              </div>
              <span className="rating-percent">{row.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yeh students ke feedback comments ki list hai */}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 14 }}>Student Feedback</h3>
        {reviews.length === 0 ? (
          <div style={{ padding: "24px 12px", textAlign: "center", color: "#64748b" }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>5 Verified Peer Reviews Recorded.</p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              Detailed written feedback will appear here once new peer sessions finish.
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div className="review-item-card" key={rev.id}>
              <img src={rev.avatar || user.avatar} alt={rev.author} className="avatar-sm" />
              <div style={{ flex: 1 }}>
                <div className="review-header">
                  <strong>{rev.author}</strong>
                  <span className="review-date">{rev.date}</span>
                </div>
                <span className="tag-pill green" style={{ fontSize: 11, padding: "2px 8px", margin: "4px 0", display: "inline-block" }}>
                  {rev.skill}
                </span>
                <p className="review-comment">"{rev.comment}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
