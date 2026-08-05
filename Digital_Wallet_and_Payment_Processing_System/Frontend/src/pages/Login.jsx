import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sessionExpiredMsg, setSessionExpiredMsg } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState(location.state?.message || '');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('expired') === 'true') {
      setSessionExpiredMsg('Your session has expired. Please log in again.');
    }
  }, [location, setSessionExpiredMsg]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      // TODO: confirm exact field names against live API docs
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (res && res.token) {
        login(res.token, formData.remember);
        navigate('/dashboard');
      } else {
        setError('Login failed. Token missing from response.');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 className="screen-title" style={{ marginBottom: '6px' }}>Sign In</h1>
        <p className="caption-text">Access your digital wallet</p>
      </div>

      {sessionExpiredMsg && <div className="alert-block alert-warning">{sessionExpiredMsg}</div>}
      {infoMessage && <div className="alert-block alert-success">{infoMessage}</div>}
      {error && <div className="alert-block alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <span className="font-label">EMAIL ADDRESS</span>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="alex@example.com"
            value={formData.email}
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

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            style={{ accentColor: 'var(--violet)' }}
          />
          <label htmlFor="remember" style={{ margin: 0, cursor: 'pointer', textTransform: 'none', fontSize: '14px', color: 'var(--text-primary)' }}>
            Remember session on this device
          </label>
        </div>

        <button type="submit" className="btn btn-gradient" style={{ marginTop: '8px' }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p className="caption-text">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--cyan)', fontWeight: 600 }}>
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
