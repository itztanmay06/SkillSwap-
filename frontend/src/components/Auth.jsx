import React, { useState } from "react";
import Icon from "../layout/Icon";
import { useApp } from "../context";

export default function Auth() {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillTitle, setSkillTitle] = useState("");
  const [category, setCategory] = useState("Programming");
  const [errorMessage, setErrorMessage] = useState("");

  const defaultAccounts = [{ email: "tanmay@example.com", password: "123", name: "Tanmay Mittal" }];
  const getAccounts = () => JSON.parse(localStorage.getItem("skillswap_accounts") || "null") || defaultAccounts;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanSkill = skillTitle.trim() || "Web Development & Coding";

    // 1. Backend API Call
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: cleanEmail, password: cleanPass }
        : { name: name.trim(), email: cleanEmail, password: cleanPass, skillTitle: cleanSkill, category };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (!isLogin) alert(`Account created! Your skill "${cleanSkill}" is now live on Explore Skills.`);
        return login(data.user.email, data.user.name, data.skill);
      }
      if (data.message) return setErrorMessage(data.message);
    } catch (err) {}

    // 2. Offline fallback with localStorage
    const accounts = getAccounts();
    if (isLogin) {
      const userFound = accounts.find((a) => a.email === cleanEmail);
      if (!userFound) return setErrorMessage("This email is not registered. Please sign up first.");
      if (userFound.password !== cleanPass) return setErrorMessage("Incorrect password. Please try again.");
      login(userFound.email, userFound.name);
    } else {
      if (accounts.some((a) => a.email === cleanEmail)) return setErrorMessage("Email already registered. Please log in.");
      const newAcc = { email: cleanEmail, password: cleanPass, name: name.trim() };
      localStorage.setItem("skillswap_accounts", JSON.stringify([...accounts, newAcc]));

      const localSkillCard = {
        id: "s-" + Date.now(),
        title: cleanSkill,
        category,
        description: `Learn ${cleanSkill} with ${name.trim()}. One-on-one peer learning session.`,
        pointsPerHour: 40,
        rating: 5.0,
        reviewsCount: 1,
        user: { name: name.trim(), title: `${name.trim()} • Skill Explorer`, location: "India", rating: 5.0 }
      };

      alert(`Account created! Your skill "${cleanSkill}" is live on Explore Skills.`);
      login(newAcc.email, newAcc.name, localSkillCard);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo-icon" style={{ margin: "0 auto 12px auto" }}>
            <Icon name="logo" size={24} color="#16a34a" />
          </div>
          <h2 className="auth-title">Skill Swap</h2>
          <p className="auth-subtitle">Exchange Skills, Not Money</p>
        </div>

        <div className="auth-tabs">
          <button type="button" className={"auth-tab-btn " + (isLogin ? "active" : "")} onClick={() => { setIsLogin(true); setErrorMessage(""); }}>
            Login
          </button>
          <button type="button" className={"auth-tab-btn " + (!isLogin ? "active" : "")} onClick={() => { setIsLogin(false); setErrorMessage(""); }}>
            Sign Up
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#b91c1c", padding: "8px 12px", borderRadius: 8, fontSize: 12, marginBottom: 14, fontWeight: 600, textAlign: "center" }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="auth-input-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} />
              </div>

              <div className="auth-input-group">
                <label>Skill You Can Teach / Share</label>
                <input type="text" placeholder="e.g. Python Programming, Graphic Design" value={skillTitle} onChange={(e) => setSkillTitle(e.target.value)} required={!isLogin} />
              </div>

              <div className="auth-input-group">
                <label>Skill Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff" }}>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Music">Music</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Languages">Languages</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <input type="email" placeholder="tanmay@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-green" style={{ width: "100%", marginTop: 8, padding: 12 }}>
            {isLogin ? "Login to Account" : "Create Account & Publish Skill"}
          </button>
        </form>

        <div style={{ marginTop: 16, padding: "8px 12px", backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, fontSize: 11, color: "#64748b", textAlign: "center" }}>
          💡 <strong>Demo Credentials:</strong> tanmay@example.com / 123
        </div>

        <div className="auth-footer-text">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="btn-link" onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); }}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
