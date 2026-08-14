import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerUser } from '../services/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 className="screen-title" style={{ marginBottom: '6px' }}>Create Account</h1>
        <p className="caption-text">Initialize your digital wallet</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <span className="font-label">FULL NAME</span>
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <span className="font-label">EMAIL ADDRESS</span>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <span className="font-label">PHONE NUMBER</span>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="input-field"
            placeholder="e.g. 08012345678"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <span className="font-label">PASSWORD</span>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <span className="font-label">CONFIRM PASSWORD</span>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="input-field"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-gradient" style={{ marginTop: '8px' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p className="caption-text">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
