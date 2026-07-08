import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApiService";
import { AuthContext } from "../context/AuthContext";
import {useContext, useState} from 'react'
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  //handle the change on the form base on inputs

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //submission of forms

  const handleSubmit = async (e) => {
    e.preventDefault(e);

    try {
      const res = await loginUser(form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (e) {
      alert(e.response?.data?.message);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Wallet Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>

            <input type="email" name="email" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input type="password" name="password" onChange={handleChange} />
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
