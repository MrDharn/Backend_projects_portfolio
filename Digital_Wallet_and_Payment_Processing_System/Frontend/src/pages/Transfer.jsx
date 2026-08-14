import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  const [transferResult, setTransferResult] = useState(null);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // If user has not configured transaction PIN, redirect immediately to Set PIN
  useEffect(() => {
    if (user && user.isPinSet === false) {
      toast.info('Please set your 4-digit transaction PIN before making transfers.');
      navigate('/set-pin', { state: { from: '/transfer' } });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();

    if (user && user.isPinSet === false) {
      toast.warning('Transaction PIN not configured. Redirecting to set PIN...');
      navigate('/set-pin', { state: { from: '/transfer' } });
      return;
    }

    const numAmount = Number(formData.amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount greater than zero.');
      return;
    }

    if (numAmount > (user?.balance || 0)) {
      toast.error('Insufficient wallet balance.');
      return;
    }

    if (!formData.pin || formData.pin.length !== 4) {
      toast.error('Please enter your 4-digit transaction PIN.');
      return;
    }

    try {
      setLoading(true);
      if (transferType === 'wallet') {
        if (!formData.recipientWallet) {
          toast.error('Please enter the recipient wallet number.');
          setLoading(false);
          return;
        }

        const res = await transferWalletToWallet({
          fromWalletNumber: user?.walletNumber,
          toWalletNumber: formData.recipientWallet,
          amount: numAmount,
          pin: formData.pin,
        });

        const ref = res?.data?.reference || res?.reference || res?.transaction?.referenceId || res?.data?.transaction?.referenceId || 'SUCCESS';
        toast.success(`Transfer of ₦${numAmount.toLocaleString()} completed!`);
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
          toast.error('Please enter bank account details.');
          setLoading(false);
          return;
        }

        const res = await withdrawToBank({
          amount: numAmount,
          bankAccount: formData.bankAccount,
          bankName: formData.bankName,
          pin: formData.pin,
        });

        const ref = res?.reference || res?.data?.reference || res?.transaction?.referenceId || 'PENDING';
        toast.loading(`Processing bank withdrawal...`, { id: 'withdraw-poll' });
        setTransferResult({
          status: 'PENDING',
          type: 'bank',
          amount: numAmount,
          recipient: `${formData.bankName} (${formData.bankAccount})`,
          reference: ref,
        });

        if (ref !== 'PENDING') {
          pollVerification(ref);
        } else {
          toast.dismiss('withdraw-poll');
          toast.success('Withdrawal request submitted successfully!');
          refreshProfile();
        }
      }
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('not set your pin') || errMsg.toLowerCase().includes('pin is not set')) {
        toast.warning('You have not set your PIN yet. Redirecting...');
        navigate('/set-pin', { state: { from: '/transfer' } });
      } else {
        toast.error(errMsg || 'Transfer failed.');
      }
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
        const verifyRes = await verifyTransferStatus(reference, 'bank');
        if (verifyRes && (verifyRes.status === 'success' || verifyRes.status === 'successful')) {
          clearInterval(interval);
          setPolling(false);
          toast.dismiss('withdraw-poll');
          toast.success('Withdrawal completed successfully!');
          setTransferResult((prev) => ({ ...prev, status: 'SUCCESS' }));
          refreshProfile();
        }
      } catch (err) {
        console.log('Polling transfer status:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        toast.dismiss('withdraw-poll');
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
        {!transferResult ? (
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
                    <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTB)</option>
                    <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="United Bank For Africa">United Bank For Africa (UBA)</option>
                    <option value="Kuda Bank">Kuda Microfinance Bank</option>
                    <option value="OPay">OPay Digital Services</option>
                    <option value="Palmpay">Palmpay</option>
                    <option value="Sterling Bank">Sterling Bank</option>
                  </select>
                </div>

                <div className="form-group">
                  <span className="font-label">ACCOUNT NUMBER</span>
                  <input
                    type="text"
                    name="bankAccount"
                    className="input-field"
                    placeholder="10-digit NUBAN"
                    maxLength={10}
                    value={formData.bankAccount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <span className="font-label">4-DIGIT PIN</span>
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
              {loading ? 'Processing Transfer...' : 'Authorize Transfer'}
            </button>
          </form>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            {transferResult.status === 'SUCCESS' && (
              <>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--gradient-hero)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 8px 28px rgba(240, 64, 154, 0.4)',
                    animation: 'modalPop 400ms var(--ease-spring)',
                  }}
                >
                  <CheckCircle size={36} strokeWidth={2} />
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Transfer Successful</h2>
                <p className="body-lg" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>
                  {formatAmount(transferResult.amount)}
                </p>
                <p className="caption-text" style={{ marginBottom: '24px' }}>
                  Sent to <strong>{transferResult.recipient}</strong>
                </p>

                <button onClick={handleDone} className="btn btn-gradient">
                  Return to Dashboard
                </button>
              </>
            )}

            {transferResult.status === 'PENDING' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-pending">Processing Withdrawal</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Transfer Queued</h2>
                <p className="caption-text" style={{ marginBottom: '20px' }}>
                  Your bank withdrawal is currently being processed by the gateway.
                </p>

                <button
                  onClick={() => pollVerification(transferResult.reference)}
                  className="btn btn-primary"
                  disabled={polling}
                >
                  {polling ? 'Verifying...' : 'Check Transfer Status'}
                </button>
              </>
            )}

            {transferResult.status === 'FAILED' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-failed">Transfer Failed</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Transfer Failed</h2>
                <p className="caption-text" style={{ marginBottom: '24px' }}>
                  The transfer could not be completed.
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