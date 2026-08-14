import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { getTransactionHistory } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ArrowDownLeft, ArrowUpRight, History, Copy, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useContext(AuthContext);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingTx(true);
      const res = await getTransactionHistory();
      const list = res?.transactions || res?.data?.transactions || res?.data || (Array.isArray(res) ? res : []);
      setRecentTransactions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load recent transactions:', err);
      setRecentTransactions([]);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
    fetchTransactions();
  }, [refreshProfile, fetchTransactions]);

  // Count-up animation on balance figure (~700ms spring)
  useEffect(() => {
    const target = Number(user?.balance || 0);
    let start = 0;
    const duration = 700;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = Math.sin((progress * Math.PI) / 2);
      setAnimatedBalance(start + (target - start) * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedBalance(target);
      }
    };

    requestAnimationFrame(animate);
  }, [user?.balance]);

  const handleCopyWalletNumber = () => {
    if (user?.walletNumber) {
      navigator.clipboard.writeText(String(user.walletNumber));
      setCopied(true);
      toast.success('Wallet number copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    toast.info('Refreshing wallet data...');
    await refreshProfile();
    await fetchTransactions();
    toast.success('Wallet updated');
  };

  const formatAmount = (num) => {
    const parsed = Number(num) || 0;
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(parsed);
  };

  const getCategoryMeta = (type) => {
    const t = (type || '').toUpperCase();
    if (t === 'DEPOSIT' || t === 'CREDIT') {
      return {
        color: 'var(--cyan)',
        bg: 'rgba(61, 220, 255, 0.15)',
        icon: <ArrowDownLeft size={20} strokeWidth={2} color="var(--cyan)" />,
        label: 'Deposit',
        isPositive: true,
      };
    }
    if (t === 'TRANSFER') {
      return {
        color: 'var(--violet)',
        bg: 'rgba(139, 92, 246, 0.15)',
        icon: <ArrowUpRight size={20} strokeWidth={2} color="var(--violet)" />,
        label: 'Transfer',
        isPositive: false,
      };
    }
    return {
      color: 'var(--coral)',
      bg: 'rgba(255, 92, 108, 0.15)',
      icon: <ArrowUpRight size={20} strokeWidth={2} color="var(--coral)" />,
      label: 'Withdrawal',
      isPositive: false,
    };
  };

  const getTransactionTitle = (tx) => {
    const type = (tx.type_of_transaction || tx.type || '').toUpperCase();
    if (type === 'DEPOSIT' || type === 'CREDIT') return 'Wallet Deposit';
    if (type === 'TRANSFER') {
      return tx.receiverWallet ? `Transfer to ${tx.receiverWallet}` : 'Wallet Transfer';
    }
    if (type === 'WITHDRAWAL' || type === 'DEBIT') {
      return tx.bankName ? `Withdrawal to ${tx.bankName}` : 'Bank Withdrawal';
    }
    return tx.description || 'Transaction';
  };

  const renderStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'SUCCESS' || s === 'SUCCESSFUL' || s === 'COMPLETED') {
      return <span className="badge-pill-success">Completed</span>;
    }
    if (s === 'PENDING') {
      return <span className="badge-pill-pending">Pending</span>;
    }
    return <span className="badge-pill-failed">Failed</span>;
  };

  return (
    <>
      <Navbar />

      <main className="app-container">
        {/* Revolut Signature Aurora Mesh Gradient Hero Balance Card */}
        <section className="aurora-hero-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="font-label" style={{ color: 'rgba(245, 245, 250, 0.75)' }}>
              AVAILABLE BALANCE
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleRefresh}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Refresh wallet"
              >
                <RefreshCw size={14} strokeWidth={2} />
              </button>

              <button
                onClick={() => setHideBalance(!hideBalance)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={hideBalance ? 'Show balance' : 'Hide balance'}
              >
                {hideBalance ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
              </button>
            </div>
          </div>

          <div className="balance-figure" style={{ marginBottom: '20px' }}>
            {hideBalance ? '••••••••' : formatAmount(animatedBalance)}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'rgba(245, 245, 250, 0.75)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                WALLET ACCOUNT NO.
              </span>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {user?.walletNumber || '—'}
              </p>
            </div>

            <button
              onClick={handleCopyWalletNumber}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {copied ? <Check size={14} strokeWidth={2} color="var(--lime)" /> : <Copy size={14} strokeWidth={2} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </section>

        {/* Quick Actions Scrollable Pill Row */}
        <section className="quick-actions-row">
          <Link to="/deposit" className="quick-action-pill">
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(61, 220, 255, 0.2)', color: 'var(--cyan)' }}>
              <ArrowDownLeft size={16} strokeWidth={2} />
            </div>
            <span>Deposit</span>
          </Link>

          <button
            onClick={() => {
              if (user && user.isPinSet === false) {
                toast.info('Please set your 4-digit transaction PIN before making transfers.');
                navigate('/set-pin', { state: { from: '/transfer' } });
              } else {
                navigate('/transfer');
              }
            }}
            className="quick-action-pill"
            style={{ background: 'var(--surface-1)', border: 'none', cursor: 'pointer' }}
          >
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: 'var(--violet)' }}>
              <ArrowUpRight size={16} strokeWidth={2} />
            </div>
            <span>Transfer</span>
          </button>

          <Link to="/transactions" className="quick-action-pill">
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(245, 245, 250, 0.15)', color: 'var(--text-primary)' }}>
              <History size={16} strokeWidth={2} />
            </div>
            <span>History</span>
          </Link>
        </section>

        {/* Category-Coded Transaction List Container */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 className="section-header">Transaction History</h2>
            {recentTransactions.length > 0 && (
              <Link to="/transactions" style={{ fontSize: '13px', color: 'var(--violet)', textDecoration: 'none', fontWeight: 600 }}>
                View All ({recentTransactions.length})
              </Link>
            )}
          </div>

          <div className="transaction-card-container">
            {loadingTx ? (
              <p className="caption-text" style={{ padding: '24px 0', textAlign: 'center' }}>
                Loading transaction history...
              </p>
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                <p className="body-lg" style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>No transactions yet</p>
                <p className="caption-text">
                  Your deposits and transfers will appear here automatically.
                </p>
              </div>
            ) : (
              recentTransactions.map((tx, idx) => {
                const type = tx.type_of_transaction || tx.type || '';
                const meta = getCategoryMeta(type);
                const title = getTransactionTitle(tx);

                return (
                  <div key={tx._id || tx.id || tx.referenceId || idx} className="transaction-row-aurora">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="category-icon-tile" style={{ backgroundColor: meta.bg }}>
                        {meta.icon}
                      </div>

                      <div>
                        <p className="body-lg" style={{ fontSize: '15px' }}>
                          {title}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span className="caption-text">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <span>•</span>
                          {renderStatusBadge(tx.status)}
                          {tx.referenceId && (
                            <>
                              <span>•</span>
                              <span className="caption-text" style={{ fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
                                Ref: {tx.referenceId.slice(0, 14)}...
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p className="body-lg" style={{ color: meta.isPositive ? 'var(--lime)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        {meta.isPositive ? '+' : '−'}{formatAmount(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
};

export default Dashboard;
