import React, { useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { setTransactionPin } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ShieldCheck } from 'lucide-react';

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
    <div className="form-group" style={{ marginBottom: '24px' }}>
      {label && (
        <span className="font-label" style={{ textAlign: 'center', marginBottom: '14px', display: 'block' }}>
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

const SetPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useContext(AuthContext);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast.error('Please enter a 4-digit PIN.');
      return;
    }

    if (pin !== confirmPin) {
      toast.error('PIN confirmation does not match.');
      return;
    }

    try {
      setLoading(true);
      await setTransactionPin({ pin });

      toast.success('Transaction PIN configured successfully!');
      await refreshProfile();
      
      const destination = location.state?.from || '/profile';
      setTimeout(() => {
        navigate(destination);
      }, 1000);
    } catch (err) {
      if (err?.status === 409 || err?.message?.toLowerCase().includes('already set')) {
        toast.warning('Transaction PIN is already configured. Redirecting to Change PIN...');
        setTimeout(() => {
          navigate('/change-pin');
        }, 1500);
      } else {
        toast.error(err.message || 'Failed to set PIN.');
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
              <ShieldCheck size={26} strokeWidth={2} />
            </div>
            <h1 className="screen-title" style={{ marginBottom: '6px' }}>Set Transaction PIN</h1>
            <p className="caption-text">
              Enter a 4-digit security PIN to authorize transactions.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <PinBoxInput
              label="ENTER 4-DIGIT PIN"
              value={pin}
              onChange={(val) => setPin(val)}
              idPrefix="set-pin"
            />

            <PinBoxInput
              label="CONFIRM 4-DIGIT PIN"
              value={confirmPin}
              onChange={(val) => setConfirmPin(val)}
              idPrefix="confirm-pin"
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
                {loading ? 'Saving PIN...' : 'Save & Continue'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default SetPin;
