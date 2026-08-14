import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { depositFunds, verifyDepositStatus } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ExternalLink, CheckCircle, ShieldCheck, CreditCard, Copy, ArrowDownLeft } from 'lucide-react';

const Deposit = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useContext(AuthContext);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [depositResult, setDepositResult] = useState(null);

  const handleChipSelect = (presetVal) => {
    setAmount(String(presetVal));
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) {
      toast.error('Minimum deposit amount is ₦100.');
      return;
    }

    try {
      setLoading(true);
      const res = await depositFunds({ amount: numAmount, method });

      if (res && res.authorizationUrl) {
        toast.info('Opening secure Paystack checkout...');
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
        toast.loading(`Waiting for payment confirmation (${reference})...`, { id: 'deposit-poll' });
        pollVerification(reference);
      } else {
        toast.error('Payment reference was not returned by the server.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to initialize deposit.');
    } finally {
      setLoading(false);
    }
  };

  const pollVerification = async (reference) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const verifyRes = await verifyDepositStatus(reference);
        if (verifyRes && (verifyRes.status === 'success' || verifyRes.status === 'successful')) {
          clearInterval(interval);
          setPolling(false);
          toast.dismiss('deposit-poll');
          toast.success('Payment verified! Wallet credited successfully.');
          setDepositResult((prev) => ({ ...prev, status: 'SUCCESS' }));
          refreshProfile();
        }
      } catch (err) {
        console.log('Polling deposit status:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        toast.dismiss('deposit-poll');
      }
    }, 4000);
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
            <h1 className="screen-title" style={{ marginBottom: '6px' }}>Top Up Wallet</h1>
            <p className="caption-text" style={{ marginBottom: '22px' }}>
              Instant funding via Debit Card, Bank Transfer, or USSD with Paystack.
            </p>

            <div className="form-group">
              <span className="font-label">TOP-UP AMOUNT (NGN)</span>
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

              {/* Instant Quick-Fund Chips */}
              <div className="amount-chip-grid">
                {[1000, 2500, 5000, 10000, 25000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`amount-chip ${Number(amount) === preset ? 'active' : ''}`}
                    onClick={() => handleChipSelect(preset)}
                  >
                    ₦{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <span className="font-label">PAYMENT GATEWAY</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--surface-2)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--border)',
                }}
              >
                <CreditCard size={20} color="var(--cyan)" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Paystack Secure Checkout</p>
                  <span className="caption-text" style={{ fontSize: '11px' }}>Cards, Bank Transfer, USSD</span>
                </div>
                <span className="badge-pill-success" style={{ fontSize: '10px' }}>Zero Fee</span>
              </div>
            </div>

            {/* PCI-DSS Security Guarantee Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(0, 210, 255, 0.08)', borderRadius: 'var(--radius-tile)', border: '1px solid rgba(0, 210, 255, 0.2)', marginBottom: '22px' }}>
              <ShieldCheck size={16} color="var(--cyan)" />
              <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 600 }}>
                256-bit SSL Encrypted • PCI-DSS Level 1 Certified
              </span>
            </div>

            <button type="submit" className="btn btn-gradient" disabled={loading}>
              {loading ? 'Initializing Checkout...' : 'Proceed to Payment'}
            </button>
          </form>
        ) : (
          <div className="receipt-card" style={{ textAlign: 'center', animation: 'modalPop 400ms var(--ease-spring)' }}>
            {depositResult.status === 'PENDING' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-pending">Awaiting Payment</span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Deposit Initialized</h2>
                <p className="caption-text" style={{ marginBottom: '20px' }}>
                  Complete the payment on the Paystack checkout window. Reference: <strong>{depositResult.reference}</strong>
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
                  {polling ? 'Verifying Transaction...' : 'Check Payment Status'}
                </button>
              </>
            )}

            {depositResult.status === 'SUCCESS' && (
              <>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--gradient-mint)',
                    color: 'var(--bg-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                  }}
                >
                  <CheckCircle size={36} strokeWidth={2.4} />
                </div>

                <span className="badge-pill-success" style={{ marginBottom: '8px' }}>Deposit Confirmed</span>
                <h2 style={{ fontSize: '34px', fontWeight: 800, margin: '8px 0', color: 'var(--mint)', fontVariantNumeric: 'tabular-nums' }}>
                  +{formatAmount(depositResult.amount)}
                </h2>
                <p className="caption-text" style={{ marginBottom: '24px' }}>
                  Funds are now available in your PayPulse wallet.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', marginBottom: '24px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption-text">Payment Gateway</span>
                    <span style={{ fontWeight: 600 }}>Paystack Checkout</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption-text">Transaction Reference</span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                      {depositResult.reference}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    refreshProfile();
                    navigate('/dashboard');
                  }}
                  className="btn btn-gradient"
                >
                  Return to Dashboard
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
