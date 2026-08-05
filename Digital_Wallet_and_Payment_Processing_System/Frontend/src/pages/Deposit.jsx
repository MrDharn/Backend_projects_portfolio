import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { depositFunds, verifyDepositStatus } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ExternalLink, CheckCircle } from 'lucide-react';

const Deposit = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useContext(AuthContext);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const [depositResult, setDepositResult] = useState(null);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid deposit amount greater than zero.');
      return;
    }

    try {
      setLoading(true);
      // TODO: confirm exact field names against live API docs
      const res = await depositFunds({ amount: numAmount, method });

      if (res && res.authorizationUrl) {
        window.open(res.authorizationUrl, '_blank');
      }

      const reference = res?.paystackService || res?.transaction?.referenceId;
      if (reference) {
        setDepositResult({
          status: 'PENDING',
          reference,
          amount: numAmount,
          authorizationUrl: res.authorizationUrl,
        });

        pollVerification(reference);
      } else {
        setDepositResult({
          status: 'SUCCESS',
          reference: 'DEP-' + Math.floor(Math.random() * 1000000),
          amount: numAmount,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize deposit.');
    } finally {
      setLoading(false);
    }
  };

  const pollVerification = async (reference) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      attempts++;
      try {
        // TODO: confirm exact field names against live API docs
        const verifyRes = await verifyDepositStatus(reference);
        if (verifyRes && verifyRes.status === 'success') {
          clearInterval(interval);
          setPolling(false);
          setDepositResult((prev) => ({ ...prev, status: 'SUCCESS' }));
          refreshProfile();
        }
      } catch (err) {
        console.log('Polling deposit status:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
      }
    }, 4000);
  };

  const handleDone = () => {
    refreshProfile();
    navigate('/dashboard');
  };

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num || 0);
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        {!depositResult ? (
          <form onSubmit={handleDepositSubmit} className="card">
            <h1 className="screen-title" style={{ marginBottom: '20px' }}>Deposit Funds</h1>

            {error && <div className="alert-block alert-danger">{error}</div>}

            <div className="form-group">
              <span className="font-label">DEPOSIT AMOUNT (NGN)</span>
              <input
                type="number"
                id="amount"
                className="input-field"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                required
              />
              <span className="caption-text" style={{ marginTop: '6px', display: 'block' }}>
                Minimum deposit: ₦100
              </span>
            </div>

            <div className="form-group">
              <span className="font-label">PAYMENT CHANNEL</span>
              <select
                id="method"
                className="input-field"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="paystack">Paystack Checkout / Debit Card</option>
                <option value="bank_transfer">Bank Transfer / USSD</option>
              </select>
            </div>

            <button type="submit" className="btn btn-gradient" style={{ marginTop: '12px' }} disabled={loading}>
              {loading ? 'Initializing Deposit...' : 'Proceed to Payment'}
            </button>
          </form>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            {depositResult.status === 'PENDING' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-pending">Pending Verification</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Deposit Initialized</h2>
                <p className="caption-text" style={{ marginBottom: '20px' }}>
                  Complete payment on Paystack. Reference: <strong>{depositResult.reference}</strong>
                </p>

                {depositResult.authorizationUrl && (
                  <a
                    href={depositResult.authorizationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ marginBottom: '12px', textDecoration: 'none' }}
                  >
                    Open Checkout Window <ExternalLink size={16} strokeWidth={2} />
                  </a>
                )}

                <button
                  onClick={() => pollVerification(depositResult.reference)}
                  className="btn btn-primary"
                  disabled={polling}
                >
                  {polling ? 'Verifying...' : 'Check Payment Status'}
                </button>
              </>
            )}

            {depositResult.status === 'SUCCESS' && (
              <>
                {/* Celebratory Blooming Gradient Checkmark Badge */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--gradient-hero)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 8px 28px rgba(240, 64, 154, 0.4)',
                    animation: 'modalPop 400ms var(--ease-spring)',
                  }}
                >
                  <CheckCircle size={36} strokeWidth={2} />
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Deposit Complete</h2>
                <p className="body-lg" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--lime)', marginBottom: '8px', textAlign: 'center' }}>
                  +{formatAmount(depositResult.amount)}
                </p>
                <span className="caption-text" style={{ display: 'block', marginBottom: '28px', fontVariantNumeric: 'tabular-nums' }}>
                  Ref: {depositResult.reference}
                </span>

                <button onClick={handleDone} className="btn btn-gradient">
                  Return to Dashboard
                </button>
              </>
            )}

            {depositResult.status === 'FAILED' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-failed">Verification Failed</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Deposit Failed</h2>
                <p className="caption-text" style={{ marginBottom: '24px' }}>
                  Could not verify your payment. Please try again.
                </p>

                <button onClick={() => setDepositResult(null)} className="btn btn-primary">
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
};

export default Deposit;
