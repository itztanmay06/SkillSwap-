import React, { useState } from "react";
import Icon from "../layout/Icon";
import { useApp } from "../context";

// Yeh basic aur simple login/signup component hai
export default function Auth() {
  const { login } = useApp();
  
  // State: login ya signup tab
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Default accounts list (agar pehli baar app run ho raha ho)
  const defaultAccounts = [
    { email: "tanmay@example.com", password: "123", name: "Tanmay Mittal" }
  ];

  // LocalStorage se registered accounts read karna
  const getAccounts = () => {
    const saved = localStorage.getItem("skillswap_accounts");
    return saved ? JSON.parse(saved) : defaultAccounts;
  };

  // Submit button dabane par check karna
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const accounts = getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Agar LOGIN kar rahe hain
    if (isLogin) {
      // Step A: Check karein ki email exist karta hai ya nahi
      const userFound = accounts.find((acc) => acc.email === cleanEmail);

      if (!userFound) {
        setErrorMessage("Yeh email registered nahi hai! Please pehle Sign Up karein.");
        return;
      }

      // Step B: Check karein ki password match ho raha hai ya nahi
      if (userFound.password !== cleanPassword) {
        setErrorMessage("Galat password! Please sahi password enter karein.");
        return;
      }

      // Step C: Sahi password hone par login karwayein
      login(userFound.email, userFound.name);
    } 
    // 2. Agar SIGN UP kar rahe hain
    else {
      if (!name.trim()) {
        setErrorMessage("Please apna naam enter karein!");
        return;
      }

      // Check karein ki email pehle se toh nahi hai
      const alreadyExists = accounts.find((acc) => acc.email === cleanEmail);
      if (alreadyExists) {
        setErrorMessage("Yeh email pehle se registered hai! Please Login karein.");
        return;
      }

      // Naya user banakar list me save karein
      const newAccount = {
        email: cleanEmail,
        password: cleanPassword,
        name: name.trim()
      };

      const updatedAccounts = [...accounts, newAccount];
      localStorage.setItem("skillswap_accounts", JSON.stringify(updatedAccounts));

      alert("Account successfully ban gaya! +200 Skill Points credited.");
      login(newAccount.email, newAccount.name);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Website ka logo aur brand */}
        <div className="auth-brand">
          <div className="brand-logo-icon" style={{ margin: "0 auto 12px auto" }}>
            <Icon name="logo" size={24} color="#16a34a" />
          </div>
          <h2 className="auth-title">Skill Swap</h2>
          <p className="auth-subtitle">Exchange Skills, Not Money</p>
        </div>

        {/* Login aur Signup switch tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={"auth-tab-btn " + (isLogin ? "active" : "")}
            onClick={() => { setIsLogin(true); setErrorMessage(""); }}
          >
            Login
          </button>
          <button
            type="button"
            className={"auth-tab-btn " + (!isLogin ? "active" : "")}
            onClick={() => { setIsLogin(false); setErrorMessage(""); }}
          >
            Sign Up
          </button>
        </div>

        {/* Error message box (agar galat password ya email ho) */}
        {errorMessage && (
          <div style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #f87171",
            color: "#b91c1c",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 14,
            fontWeight: 600,
            textAlign: "center"
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Sign Up mode me Full Name */}
          {!isLogin && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Tanmay Mittal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          {/* Email input */}
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="tanmay@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-green" style={{ width: "100%", marginTop: 8, padding: 12 }}>
            {isLogin ? "Login to Account" : "Create Account (+200 Coins)"}
          </button>
        </form>

        {/* Demo hints box */}
        <div style={{
          marginTop: 16,
          padding: "8px 12px",
          backgroundColor: "#f8fafc",
          border: "1px dashed #cbd5e1",
          borderRadius: 8,
          fontSize: 11,
          color: "#64748b",
          textAlign: "center"
        }}>
          💡 <strong>Demo Credentials:</strong> tanmay@example.com / 123
        </div>

        {/* Switch text footer */}
        <div className="auth-footer-text">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => { setIsLogin(false); setErrorMessage(""); }}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => { setIsLogin(true); setErrorMessage(""); }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
