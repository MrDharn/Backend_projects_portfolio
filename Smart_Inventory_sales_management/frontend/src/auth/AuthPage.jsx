import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { user, token, handleLogin, handleRegister, handleLogout } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        await handleLogin({ email: form.email, password: form.password });
        alert("Logged in successfully!");
      } else {
        await handleRegister(form);
        alert("Registration complete! Please login.");
        setIsLoginView(true);
      }
    } catch (err) {
      alert(
        "Authentication error: " + (err.response?.data?.message || err.message),
      );
    }
  };

  if (token) {
    return (
      <div className="auth-container">
        <div className="auth-header">
          <h3>Active Session</h3>
          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Logged in as:{" "}
            <strong>{user?.email || "Authenticated User"}</strong>
          </p>
          <button
            className="btn btn-danger"
            style={{ width: "100%" }}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div
        className="auth-header"
        style={{ maxWidth: "400px", margin: "40px auto" }}
      >
        <h3>{isLoginView ? "Welcome Back" : "Register Account"}</h3>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          {isLoginView
            ? "Sign in to access your inventory"
            : "Fill in the details to get started"}
        </p>
      </div>

      <form className="form-group" onSubmit={onSubmit}>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {!isLoginView && (
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        )}

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" className="btn btn-primary">
          {isLoginView ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="auth-toggle">
        {isLoginView ? "Don't have an account? " : "Already registered? "}
        <span
          className="auth-link"
          onClick={() => setIsLoginView(!isLoginView)}
        >
          {isLoginView ? "Register" : "Login"}
        </span>
      </div>
    </div>
  );
}
