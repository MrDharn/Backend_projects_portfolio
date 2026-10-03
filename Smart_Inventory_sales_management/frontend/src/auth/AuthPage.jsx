import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function AuthPage() {

  const navigate = useNavigate()

  const {handleLogin, handleRegister, handleLogout, isAuthenticated } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const resetForm = () => {
    setForm({ username: "", email: "", password: "" });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const toggleView = () => {
    setIsLoginView((prev) => !prev);
    resetForm();
  };

  if(isAuthenticated){
    return <Navigate to = '/dashboard' replace / >
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLoginView) {
        // Corrected payload: pass username/email according to your backend strategy
        await handleLogin({ email: form.email, password: form.password });
        setSuccessMsg("Logged in successfully!");

        navigate('/dashboard', {replace: true})
      } else {
        await handleRegister(form);
        setSuccessMsg("Registration complete! Please login.");
        setIsLoginView(true);
        resetForm();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "An authentication error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (token) {
    return (
      <div className="auth-container">
        <div className="auth-header">
          <h3>Active Session</h3>
          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Logged in as:{" "}
            <strong>{user?.username || user?.email || "Authenticated User"}</strong>
          </p>
          <button
            type="button"
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

      {errorMsg && (
        <div className="alert alert-error" style={{ color: "#ef4444", marginBottom: "1rem" }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ color: "#10b981", marginBottom: "1rem" }}>
          {successMsg}
        </div>
      )}

      <form className="form-group" onSubmit={onSubmit}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="username"
          required
        />

        {!isLoginView && (
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            required
          />
        )}

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete={isLoginView ? "current-password" : "new-password"}
          required
        />

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : isLoginView
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>

      <div className="auth-toggle" style={{ marginTop: "1rem" }}>
        {isLoginView ? "Don't have an account? " : "Already registered? "}
        <button
          type="button"
          className="auth-link-btn"
          onClick={toggleView}
          style={{
            background: "none",
            border: "none",
            color: "#3b82f6",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            font: "inherit",
          }}
        >
          {isLoginView ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
}