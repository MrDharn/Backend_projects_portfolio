import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from your old password.');
      return;
    }

    try {
      setLoading(true);
      // TODO: confirm exact field names against live API docs
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        <div className="card">
          <h1 className="screen-title" style={{ marginBottom: '16px' }}>Change Password</h1>

          {error && <div className="alert-block alert-danger">{error}</div>}
          {success && <div className="alert-block alert-success">Password updated successfully! Redirecting...</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <span className="font-label">CURRENT PASSWORD</span>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                className="input-field"
                placeholder="••••••••"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <span className="font-label">NEW PASSWORD</span>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="input-field"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <span className="font-label">CONFIRM NEW PASSWORD</span>
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

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={loading || success}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default ChangePassword;
