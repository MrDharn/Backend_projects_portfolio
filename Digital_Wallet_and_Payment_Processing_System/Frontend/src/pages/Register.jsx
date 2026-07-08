import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApiService";
import "../styles/login.css";
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  //handle The change

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Handle the submission From backednd

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      alert("You have registered successfully, kindly Login !!!!");

      navigate("/login");
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>

            <input name="name" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input type="email" name="email" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Phone</label>

            <input name="phone" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input type="password" name="password" onChange={handleChange} />
          </div>

          <button className="auth-btn">Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
