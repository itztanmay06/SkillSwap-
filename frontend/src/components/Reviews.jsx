import React from "react";
import Header from "../layout/Header";
import Icon from "../layout/Icon";
import Avatar from "../layout/Avatar";
import { useApp } from "../context";

export default function Reviews() {
  const { user, reviews, setReviews, setUser, addReview } = useApp();

  const totalReviews = reviews.length;
  const currentRating = totalReviews > 0 ? (user.rating || 5.0).toFixed(1) : "0.0";

  const ratingBreakdown = [
    { stars: "5 Stars", count: reviews.filter((r) => r.rating === 5).length },
    { stars: "4 Stars", count: reviews.filter((r) => r.rating === 4).length },
    { stars: "3 Stars", count: reviews.filter((r) => r.rating === 3).length },
    { stars: "2 Stars", count: reviews.filter((r) => r.rating === 2).length },
    { stars: "1 Star", count: reviews.filter((r) => r.rating === 1).length }
  ];

  const breakdownWithPercent = ratingBreakdown.map((row) => ({
    ...row,
    percent: totalReviews > 0 ? Math.round((row.count / totalReviews) * 100) : 0
  }));

  const handleSimulateFeedback = () => {
    addReview({
      author: "Vanshika Jindal",
      rating: 5,
      skill: "Acoustic Guitar & Music",
      date: "Just now",
      comment: "Tanmay explained web concepts and state flow brilliantly. Great learning partner and fast responder!"
    });
  };

  const handleResetReviews = () => {
    setReviews([]);
    setUser({ ...user, reviewCount: 0, rating: 0 });
  };

  return (
    <div className="page">
      {}
      <Header
        title="Community Ratings & Reviews"
        subtitle="Feedback and trust ratings earned through completed skill exchanges."
      />

      <div className="section-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="section-title">Rating Summary</h2>
          <p className="section-subtitle">Based on peer reviews from your skill sessions.</p>
        </div>

        {}
        <div style={{ display: "flex", gap: "8px" }}>
          {totalReviews === 0 ? (
            <button className="btn-green-sm" onClick={handleSimulateFeedback}>
              + Receive Feedback from Peer
            </button>
          ) : (
            <button className="btn-outline" style={{ fontSize: "12px", padding: "6px 10px" }} onClick={handleResetReviews}>
              Reset Reviews to 0
            </button>
          )}
        </div>
      </div>

      {}
      <div className="panel reviews-panel">
        <div className="reviews-score">
          <div className="reviews-big-number">{currentRating}</div>
          <div className="reviews-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <Icon
                key={n}
                name="star"
                size={18}
                fill={totalReviews > 0 ? "#f59e0b" : "none"}
                color={totalReviews > 0 ? "#f59e0b" : "#cbd5e1"}
              />
            ))}
          </div>
          <div className="reviews-count">Based on {totalReviews} completed exchanges</div>
        </div>

        {}
        <div className="reviews-bars">
          {breakdownWithPercent.map((row) => (
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

      {}
      <div className="panel" style={{ marginTop: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 14 }}>Student Feedback</h3>

        {totalReviews === 0 ? (
          <div style={{ padding: "36px 16px", textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⭐</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>
              0 Reviews (No Feedback Yet)
            </p>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 6, maxWidth: "420px", margin: "6px auto 16px auto" }}>
              Reviews are 0 by default. Once you complete a skill exchange session, the student will leave verified feedback here.
            </p>
            <button className="btn-green-sm" onClick={handleSimulateFeedback}>
              View Example Feedback from Student
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.map((rev) => (
              <div className="review-item-card" key={rev.id} style={{ display: "flex", gap: "14px", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <Avatar name={rev.author || "Peer"} size="md" />
                <div style={{ flex: 1 }}>
                  <div className="review-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: 15, color: "#0f172a" }}>{rev.author}</strong>
                      <div style={{ display: "flex", gap: "2px", marginTop: "3px" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Icon key={s} name="star" size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <span className="review-date" style={{ fontSize: 12, color: "#64748b" }}>{rev.date}</span>
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <span className="tag-pill green" style={{ fontSize: 11, padding: "2px 8px", display: "inline-block" }}>
                      Skill: {rev.skill}
                    </span>
                  </div>

                  <p className="review-comment" style={{ fontSize: 13, color: "#334155", marginTop: "8px", lineHeight: "1.5", fontStyle: "italic" }}>
                    "{rev.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
