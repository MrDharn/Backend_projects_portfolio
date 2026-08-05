import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setTransactionPin } from '../services/apiClient';
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

const SetPin = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useContext(AuthContext);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 numeric digits.');
      return;
    }

    if (pin !== confirmPin) {
      setError('PIN confirmation does not match.');
      return;
    }

    try {
      setLoading(true);
      // TODO: confirm exact field names against live API docs
      await setTransactionPin({ pin });

      setSuccess(true);
      await refreshProfile();
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      if (err?.status === 409 || err?.message?.toLowerCase().includes('already set')) {
        setError('Transaction PIN is already configured. Redirecting to Change PIN...');
        setTimeout(() => {
          navigate('/change-pin');
        }, 2000);
      } else {
        setError(err.message || 'Failed to set PIN.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        <div className="card">
          <h1 className="screen-title" style={{ marginBottom: '8px' }}>Set Transaction PIN</h1>
          <p className="caption-text" style={{ marginBottom: '24px' }}>
            Create a 4-digit security PIN for authorizing wallet transactions.
          </p>

          {error && <div className="alert-block alert-danger">{error}</div>}
          {success && <div className="alert-block alert-success">Transaction PIN configured! Redirecting...</div>}

          <form onSubmit={handleSubmit}>
            <AuroraPinInput
              label="ENTER 4-DIGIT PIN"
              value={pin}
              onChange={(val) => {
                setPin(val);
                setError('');
              }}
            />

            <AuroraPinInput
              label="CONFIRM 4-DIGIT PIN"
              value={confirmPin}
              onChange={(val) => {
                setConfirmPin(val);
                setError('');
              }}
            />

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={loading || success}>
              {loading ? 'Setting PIN...' : 'Save Transaction PIN'}
            </button>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default SetPin;
