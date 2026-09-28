import React, { useState } from "react";
import Icon from "../layout/Icon";
import { useApp } from "../context";

// Authentication component for Login and Registration
export default function Auth() {
  const { login } = useApp();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Default accounts for offline/initial state
  const defaultAccounts = [
    { email: "tanmay@example.com", password: "123", name: "Tanmay Mittal" }
  ];

  // Retrieve stored accounts from localStorage
  const getAccounts = () => {
    const saved = localStorage.getItem("skillswap_accounts");
    return saved ? JSON.parse(saved) : defaultAccounts;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const accounts = getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Handle Login
    if (isLogin) {
      // Step A: Attempt backend API authentication
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          login(data.user.email, data.user.name);
          return;
        } else if (response.status === 400 || response.status === 404) {
          setErrorMessage(data.message || "Invalid credentials!");
          return;
        }
      } catch (err) {
        // Fallback to local storage if backend server is unreachable
      }

      // Step B: Offline local storage fallback
      const userFound = accounts.find((acc) => acc.email === cleanEmail);

      if (!userFound) {
        setErrorMessage("This email is not registered. Please sign up first.");
        return;
      }

      if (userFound.password !== cleanPassword) {
        setErrorMessage("Incorrect password. Please verify and try again.");
        return;
      }

      login(userFound.email, userFound.name);
    } 
    // 2. Handle Sign Up
    else {
      if (!name.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }

      // Step A: Attempt backend registration
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: cleanEmail, password: cleanPassword })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          alert("Account created successfully! +200 Skill Points credited.");
          login(data.user.email, data.user.name);
          return;
        } else if (response.status === 400) {
          setErrorMessage(data.message || "User already exists!");
          return;
        }
      } catch (err) {
        // Fallback to local storage
      }

      // Step B: Offline local fallback
      const alreadyExists = accounts.find((acc) => acc.email === cleanEmail);
      if (alreadyExists) {
        setErrorMessage("This email is already registered. Please log in.");
        return;
      }

      const newAccount = {
        email: cleanEmail,
        password: cleanPassword,
        name: name.trim()
      };

      const updatedAccounts = [...accounts, newAccount];
      localStorage.setItem("skillswap_accounts", JSON.stringify(updatedAccounts));

      alert("Account created successfully! +200 Skill Points credited.");
      login(newAccount.email, newAccount.name);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="brand-logo-icon" style={{ margin: "0 auto 12px auto" }}>
            <Icon name="logo" size={24} color="#16a34a" />
          </div>
          <h2 className="auth-title">Skill Swap</h2>
          <p className="auth-subtitle">Exchange Skills, Not Money</p>
        </div>

        {/* Auth Mode Toggle */}
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

        {/* Error notification banner */}
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name input for registration */}
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
