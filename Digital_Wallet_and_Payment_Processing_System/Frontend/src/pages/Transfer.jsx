import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { transferWalletToWallet, withdrawToBank, verifyTransferStatus } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { CheckCircle } from 'lucide-react';

const Transfer = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useContext(AuthContext);

  const [transferType, setTransferType] = useState('wallet');
  const [formData, setFormData] = useState({
    recipientWallet: '',
    bankAccount: '',
    bankName: 'Access Bank',
    amount: '',
    pin: '',
  });

  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const [transferResult, setTransferResult] = useState(null);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const isPinSet = user?.isPinSet !== false;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(formData.amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    if (numAmount > (user?.balance || 0)) {
      setError('Insufficient wallet balance.');
      return;
    }

    if (!formData.pin || formData.pin.length !== 4) {
      setError('Please enter your 4-digit transaction PIN.');
      return;
    }

    try {
      setLoading(true);
      if (transferType === 'wallet') {
        if (!formData.recipientWallet) {
          setError('Please enter the recipient wallet number.');
          setLoading(false);
          return;
        }

        // TODO: confirm exact field names against live API docs
        const res = await transferWalletToWallet({
          fromWalletNumber: user?.walletNumber,
          toWalletNumber: formData.recipientWallet,
          amount: numAmount,
          pin: formData.pin,
        });

        const ref = res?.data?.reference || 'TRF-' + Math.floor(Math.random() * 1000000);
        setTransferResult({
          status: 'SUCCESS',
          type: 'wallet',
          amount: numAmount,
          recipient: formData.recipientWallet,
          reference: ref,
        });
        refreshProfile();
      } else {
        if (!formData.bankAccount || !formData.bankName) {
          setError('Please enter bank account details.');
          setLoading(false);
          return;
        }

        // TODO: confirm exact field names against live API docs
        const res = await withdrawToBank({
          amount: numAmount,
          bankAccount: formData.bankAccount,
          bankName: formData.bankName,
          pin: formData.pin,
        });

        const ref = res?.reference || 'WTH-' + Math.floor(Math.random() * 1000000);
        setTransferResult({
          status: 'PENDING',
          type: 'bank',
          amount: numAmount,
          recipient: `${formData.bankName} (${formData.bankAccount})`,
          reference: ref,
        });

        pollVerification(ref);
      }
    } catch (err) {
      setError(err.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  const pollVerification = async (reference) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 5;

    const interval = setInterval(async () => {
      attempts++;
      try {
        // TODO: confirm exact field names against live API docs
        const verifyRes = await verifyTransferStatus(reference, 'bank');
        if (verifyRes && verifyRes.status === 'success') {
          clearInterval(interval);
          setPolling(false);
          setTransferResult((prev) => ({ ...prev, status: 'SUCCESS' }));
          refreshProfile();
        }
      } catch (err) {
        console.log('Polling transfer status:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
      }
    }, 3000);
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
        {!isPinSet ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <span className="badge-pill-pending" style={{ marginBottom: '12px' }}>Security Notice</span>
            <h1 className="screen-title" style={{ marginBottom: '8px' }}>PIN Required</h1>
            <p className="caption-text" style={{ marginBottom: '24px' }}>
              You have not configured a 4-digit transaction PIN yet. Transfers are disabled until a PIN is set.
            </p>
            <button onClick={() => navigate('/set-pin')} className="btn btn-gradient">
              Set Transaction PIN Now
            </button>
          </div>
        ) : !transferResult ? (
          <form onSubmit={handleTransferSubmit} className="card">
            <h1 className="screen-title" style={{ marginBottom: '20px' }}>Transfer Funds</h1>

            {/* Mode selection buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                className={`btn ${transferType === 'wallet' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: '40px', fontSize: '13px', borderRadius: '9999px', padding: '0 16px' }}
                onClick={() => setTransferType('wallet')}
              >
                Wallet to Wallet
              </button>
              <button
                type="button"
                className={`btn ${transferType === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: '40px', fontSize: '13px', borderRadius: '9999px', padding: '0 16px' }}
                onClick={() => setTransferType('bank')}
              >
                Bank Withdrawal
              </button>
            </div>

            {error && <div className="alert-block alert-danger">{error}</div>}

            <div className="form-group">
              <span className="font-label">TRANSFER AMOUNT (NGN)</span>
              <input
                type="number"
                name="amount"
                className="input-field"
                placeholder="e.g. 2500"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <span className="caption-text" style={{ marginTop: '6px', display: 'block' }}>
                Available Balance: {formatAmount(user?.balance)}
              </span>
            </div>

            {transferType === 'wallet' ? (
              <div className="form-group">
                <span className="font-label">RECIPIENT WALLET NUMBER</span>
                <input
                  type="text"
                  name="recipientWallet"
                  className="input-field"
                  placeholder="e.g. 1234567890"
                  value={formData.recipientWallet}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <span className="font-label">BANK NAME</span>
                  <select
                    name="bankName"
                    className="input-field"
                    value={formData.bankName}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Access Bank">Access Bank</option>
                    <option value="GTBank">Guaranty Trust Bank (GTB)</option>
                    <option value="First Bank">First Bank of Nigeria</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="Kuda Bank">Kuda Microfinance Bank</option>
                    <option value="OPay">OPay Digital Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <span className="font-label">ACCOUNT NUMBER</span>
                  <input
                    type="text"
                    name="bankAccount"
                    className="input-field"
                    placeholder="10-digit Account Number"
                    maxLength={10}
                    value={formData.bankAccount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <span className="font-label">4-DIGIT SECURITY PIN</span>
              <input
                type="password"
                name="pin"
                className="input-field"
                placeholder="••••"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-gradient" style={{ marginTop: '12px' }} disabled={loading}>
              {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
            </button>
          </form>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            {transferResult.status === 'PENDING' ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-pending">Processing Withdrawal</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Dispatched to Bank</h2>
                <p className="body-lg" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>
                  −{formatAmount(transferResult.amount)}
                </p>
                <p className="caption-text" style={{ marginBottom: '20px' }}>
                  Destination: {transferResult.recipient}
                </p>
                <span className="caption-text" style={{ display: 'block', marginBottom: '28px', fontVariantNumeric: 'tabular-nums' }}>
                  Ref: {transferResult.reference}
                </span>

                <button onClick={handleDone} className="btn btn-primary">
                  Return to Dashboard
                </button>
              </>
            ) : transferResult.status === 'SUCCESS' ? (
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

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Transfer Complete</h2>
                <p className="body-lg" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>
                  −{formatAmount(transferResult.amount)}
                </p>
                <p className="caption-text" style={{ marginBottom: '16px' }}>
                  Sent to {transferResult.recipient}
                </p>
                <span className="caption-text" style={{ display: 'block', marginBottom: '28px', fontVariantNumeric: 'tabular-nums' }}>
                  Ref: {transferResult.reference}
                </span>

                <button onClick={handleDone} className="btn btn-gradient">
                  Done
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-failed">Transfer Failed</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Transfer Failed</h2>
                <p className="caption-text" style={{ marginBottom: '24px' }}>
                  Unable to complete transaction. Your wallet balance has not been debited.
                </p>

                <button onClick={() => setTransferResult(null)} className="btn btn-primary">
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

export default Transfer;