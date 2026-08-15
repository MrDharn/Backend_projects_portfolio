import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { changeTransactionPin } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { KeyRound } from 'lucide-react';

const PinBoxInput = ({ label, value = '', onChange, idPrefix = 'pin' }) => {
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const digits = value.split('').slice(0, 4);

  const handleDigitChange = (index, e) => {
    const rawVal = e.target.value;
    const cleanDigit = rawVal.replace(/\D/g, '');

    if (!cleanDigit) {
      const newDigits = [digits[0] || '', digits[1] || '', digits[2] || '', digits[3] || ''];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    if (cleanDigit.length > 1) {
      const pastedChars = cleanDigit.slice(0, 4);
      onChange(pastedChars);
      const nextFocus = Math.min(pastedChars.length, 3);
      inputRefs[nextFocus]?.current?.focus();
      return;
    }

    const newDigits = [digits[0] || '', digits[1] || '', digits[2] || '', digits[3] || ''];
    newDigits[index] = cleanDigit.slice(-1);
    const updated = newDigits.join('').slice(0, 4);
    onChange(updated);

    if (index < 3 && cleanDigit) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs[index - 1]?.current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length - 1, 3);
      inputRefs[nextFocus]?.current?.focus();
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: '20px' }}>
      {label && (
        <span className="font-label" style={{ textAlign: 'center', marginBottom: '12px', display: 'block' }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {[0, 1, 2, 3].map((idx) => {
          const val = digits[idx] || '';
          return (
            <input
              key={idx}
              ref={inputRefs[idx]}
              id={`${idPrefix}-${idx}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={val}
              onChange={(e) => handleDigitChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className="pin-box-input"
              autoComplete="off"
            />
          );
        })}
      </div>
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPin || formData.oldPin.length !== 4) {
      toast.error('Please enter your current 4-digit PIN.');
      return;
    }

    if (!formData.newPin || formData.newPin.length !== 4) {
      toast.error('New PIN must be exactly 4 numeric digits.');
      return;
    }

    if (formData.newPin !== formData.confirmPin) {
      toast.error('New PIN and confirmation do not match.');
      return;
    }

    if (formData.oldPin === formData.newPin) {
      toast.error('New PIN must be different from your current PIN.');
      return;
    }

    try {
      setLoading(true);
      await changeTransactionPin({
        oldPin: formData.oldPin,
        newPin: formData.newPin,
        confirmPin: formData.confirmPin,
      });

      toast.success('Transaction PIN updated successfully!');
      await refreshProfile();
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Failed to change PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <KeyRound size={26} strokeWidth={2} />
            </div>
            <h1 className="screen-title" style={{ marginBottom: '6px' }}>Change Transaction PIN</h1>
            <p className="caption-text">
              Update your 4-digit PIN used for wallet authorizations.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <PinBoxInput
              label="CURRENT 4-DIGIT PIN"
              value={formData.oldPin}
              onChange={(val) => setFormData({ ...formData, oldPin: val })}
              idPrefix="old-pin"
            />

            <PinBoxInput
              label="NEW 4-DIGIT PIN"
              value={formData.newPin}
              onChange={(val) => setFormData({ ...formData, newPin: val })}
              idPrefix="new-pin"
            />

            <PinBoxInput
              label="CONFIRM NEW 4-DIGIT PIN"
              value={formData.confirmPin}
              onChange={(val) => setFormData({ ...formData, confirmPin: val })}
              idPrefix="confirm-new-pin"
            />

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
                {loading ? 'Updating PIN...' : 'Update PIN'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default ChangePin;
