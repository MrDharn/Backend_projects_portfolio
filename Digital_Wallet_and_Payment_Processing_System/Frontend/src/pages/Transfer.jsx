import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { transferWalletToWallet, withdrawToBank, verifyTransferStatus } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { CheckCircle, Zap, Shield, ArrowUpRight, Send, Building, Copy } from 'lucide-react';

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

  // Guard: Prompt and route to set PIN if not set
  useEffect(() => {
    if (user && user.isPinSet === false) {
      toast.info('Please set your 4-digit transaction PIN before initiating transfers.');
      navigate('/set-pin', { state: { from: '/transfer' } });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChipSelect = (presetVal) => {
    if (presetVal === 'max') {
      setFormData({ ...formData, amount: String(user?.balance || 0) });
    } else {
      setFormData({ ...formData, amount: String(presetVal) });
    }
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
      toast.error('Insufficient wallet balance for this transfer.');
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

        if (formData.recipientWallet === String(user?.walletNumber)) {
          toast.error('You cannot transfer funds to your own wallet account.');
          setLoading(false);
          return;
        }

        const res = await transferWalletToWallet({
          fromWalletNumber: user?.walletNumber,
          toWalletNumber: formData.recipientWallet,
          amount: numAmount,
          pin: formData.pin,
        });

        const ref = res?.data?.reference || res?.reference || res?.transaction?.referenceId || res?.data?.transaction?.referenceId || 'COMPLETED';
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
        if (!formData.bankAccount || formData.bankAccount.length !== 10) {
          toast.error('Please enter a valid 10-digit NUBAN account number.');
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
        toast.warning('You have not configured your PIN yet. Redirecting...');
        navigate('/set-pin', { state: { from: '/transfer' } });
      } else {
        toast.error(errMsg || 'Transfer failed. Please check your details.');
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
          toast.success('Bank withdrawal completed successfully!');
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

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num || 0);
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        {!transferResult ? (
          <form onSubmit={handleTransferSubmit} className="card">
            <h1 className="screen-title" style={{ marginBottom: '6px' }}>Send Money</h1>
            <p className="caption-text" style={{ marginBottom: '20px' }}>
              Instant transfers to PayPulse wallets or commercial bank accounts.
            </p>

            {/* Segmented Transfer Mode Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--surface-2)', padding: '4px', borderRadius: 'var(--radius-pill)', marginBottom: '20px' }}>
              <button
                type="button"
                className="btn"
                style={{
                  height: '42px',
                  fontSize: '13px',
                  borderRadius: 'var(--radius-pill)',
                  background: transferType === 'wallet' ? 'var(--gradient-button)' : 'transparent',
                  color: transferType === 'wallet' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
                onClick={() => setTransferType('wallet')}
              >
                <Send size={15} strokeWidth={2} /> Wallet to Wallet
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  height: '42px',
                  fontSize: '13px',
                  borderRadius: 'var(--radius-pill)',
                  background: transferType === 'bank' ? 'var(--gradient-button)' : 'transparent',
                  color: transferType === 'bank' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
                onClick={() => setTransferType('bank')}
              >
                <Building size={15} strokeWidth={2} /> Bank Account
              </button>
            </div>

            {/* Transfer Amount Input */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-label">TRANSFER AMOUNT (NGN)</span>
                <span className="caption-text" style={{ fontSize: '11px' }}>
                  Balance: <strong>{formatAmount(user?.balance)}</strong>
                </span>
              </div>

              <input
                type="number"
                name="amount"
                className="input-field"
                placeholder="e.g. 5000"
                value={formData.amount}
                onChange={handleChange}
                min="50"
                required
              />

              {/* Instant Amount Preset Chips */}
              <div className="amount-chip-grid">
                {[1000, 5000, 10000, 25000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`amount-chip ${Number(formData.amount) === preset ? 'active' : ''}`}
                    onClick={() => handleChipSelect(preset)}
                  >
                    ₦{preset.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  className="amount-chip"
                  style={{ color: 'var(--mint)' }}
                  onClick={() => handleChipSelect('max')}
                >
                  Max Balance
                </button>
              </div>
            </div>

            {transferType === 'wallet' ? (
              <div className="form-group">
                <span className="font-label">RECIPIENT WALLET ACCOUNT NO.</span>
                <input
                  type="text"
                  name="recipientWallet"
                  className="input-field"
                  placeholder="10-digit PayPulse wallet number"
                  maxLength={10}
                  value={formData.recipientWallet}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <span className="font-label">SELECT DESTINATION BANK</span>
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
                  <span className="font-label">10-DIGIT NUBAN ACCOUNT NUMBER</span>
                  <input
                    type="text"
                    name="bankAccount"
                    className="input-field"
                    placeholder="Enter NUBAN number"
                    maxLength={10}
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
              </>
            )}

            {/* Zero-Fee Guarantee Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(0, 245, 155, 0.08)', borderRadius: 'var(--radius-tile)', border: '1px solid rgba(0, 245, 155, 0.2)', marginBottom: '20px' }}>
              <Zap size={16} color="var(--mint)" />
              <span style={{ fontSize: '12px', color: 'var(--mint)', fontWeight: 600 }}>
                Instant Settlement • 0.00% Platform Transfer Fee
              </span>
            </div>

            {/* 4-Box Security PIN Input */}
            <PinBoxInput
              label="ENTER 4-DIGIT AUTHORIZATION PIN"
              value={formData.pin}
              onChange={(val) => setFormData({ ...formData, pin: val })}
              idPrefix="transfer-pin"
            />

            <button type="submit" className="btn btn-gradient" disabled={loading}>
              {loading ? 'Authorizing Transfer...' : 'Authorize & Send Money'}
            </button>
          </form>
        ) : (
          <div className="receipt-card" style={{ textAlign: 'center', animation: 'modalPop 400ms var(--ease-spring)' }}>
            {transferResult.status === 'SUCCESS' && (
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

                <span className="badge-pill-success" style={{ marginBottom: '8px' }}>Payment Successful</span>
                <h2 style={{ fontSize: '34px', fontWeight: 800, margin: '8px 0', fontVariantNumeric: 'tabular-nums' }}>
                  {formatAmount(transferResult.amount)}
                </h2>
                <p className="caption-text" style={{ marginBottom: '24px' }}>
                  Successfully sent to <strong>{transferResult.recipient}</strong>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', marginBottom: '24px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption-text">Transaction Reference</span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                      {transferResult.reference}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption-text">Settlement Status</span>
                    <span style={{ color: 'var(--mint)', fontWeight: 600 }}>Instant Settled</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(transferResult.reference);
                      toast.success('Reference copied to clipboard!');
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    <Copy size={16} strokeWidth={2} /> Copy Ref
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      refreshProfile();
                      navigate('/dashboard');
                    }}
                    className="btn btn-gradient"
                    style={{ flex: 1 }}
                  >
                    Dashboard
                  </button>
                </div>
              </>
            )}

            {transferResult.status === 'PENDING' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-pill-pending">Processing Withdrawal</span>
                </div>

                <h2 className="section-header" style={{ marginBottom: '8px' }}>Transfer Queued</h2>
                <p className="caption-text" style={{ marginBottom: '20px' }}>
                  Your bank withdrawal is currently being cleared with the central switch.
                </p>

                <button
                  onClick={() => pollVerification(transferResult.reference)}
                  className="btn btn-primary"
                  disabled={polling}
                >
                  {polling ? 'Verifying...' : 'Check Status Now'}
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