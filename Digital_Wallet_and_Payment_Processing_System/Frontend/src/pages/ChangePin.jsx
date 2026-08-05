import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { changeTransactionPin } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const AuroraPinInput = ({ label, value, onChange }) => {
  const isComplete = value.length === 4;

  return (
    <div className="form-group">
      <span className="font-label" style={{ textAlign: 'center', marginBottom: '12px' }}>{label}</span>
      <div className="pin-tile-container">
        {[0, 1, 2, 3].map((idx) => {
          const char = value[idx];
          return (
            <div
              key={idx}
              className={`pin-tile ${char ? 'filled' : ''} ${isComplete ? 'flash' : ''}`}
            >
              {char ? '•' : ''}
            </div>
          );
        })}
      </div>
      <input
        type="password"
        className="input-field"
        placeholder="Enter 4 numeric digits"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
      />
    </div>
  );
};

const ChangePin = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.oldPin || formData.oldPin.length !== 4) {
      setError('Please enter your current 4-digit PIN.');
      return;
    }

    if (!formData.newPin || formData.newPin.length !== 4) {
      setError('New PIN must be exactly 4 numeric digits.');
      return;
    }

    if (formData.newPin !== formData.confirmPin) {
      setError('New PIN and confirmation do not match.');
      return;
    }

    if (formData.oldPin === formData.newPin) {
      setError('New PIN must be different from your current PIN.');
      return;
    }

    try {
      setLoading(true);
      // TODO: confirm exact field names against live API docs
      await changeTransactionPin({
        oldPin: formData.oldPin,
        newPin: formData.newPin,
        confirmPin: formData.confirmPin,
      });

      setSuccess(true);
      await refreshProfile();
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to change PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        <div className="card">
          <h1 className="screen-title" style={{ marginBottom: '8px' }}>Change Transaction PIN</h1>
          <p className="caption-text" style={{ marginBottom: '24px' }}>
            Update your 4-digit PIN used for wallet authorizations.
          </p>

          {error && <div className="alert-block alert-danger">{error}</div>}
          {success && <div className="alert-block alert-success">Transaction PIN updated! Redirecting...</div>}

          <form onSubmit={handleSubmit}>
            <AuroraPinInput
              label="CURRENT 4-DIGIT PIN"
              value={formData.oldPin}
              onChange={(val) => {
                setFormData({ ...formData, oldPin: val });
                setError('');
              }}
            />

            <AuroraPinInput
              label="NEW 4-DIGIT PIN"
              value={formData.newPin}
              onChange={(val) => {
                setFormData({ ...formData, newPin: val });
                setError('');
              }}
            />

            <AuroraPinInput
              label="CONFIRM NEW 4-DIGIT PIN"
              value={formData.confirmPin}
              onChange={(val) => {
                setFormData({ ...formData, confirmPin: val });
                setError('');
              }}
            />

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={loading || success}>
              {loading ? 'Updating PIN...' : 'Update Transaction PIN'}
            </button>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default ChangePin;
