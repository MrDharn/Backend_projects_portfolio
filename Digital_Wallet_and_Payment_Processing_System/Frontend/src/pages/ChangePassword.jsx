import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error('New password must be different from your current password.');
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success('Password updated successfully! Please sign in again.');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default ChangePassword;
