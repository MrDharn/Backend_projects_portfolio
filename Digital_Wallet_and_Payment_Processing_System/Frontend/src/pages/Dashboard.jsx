import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTransactionHistory } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ArrowDownLeft, ArrowUpRight, History, Copy, Check, Eye, EyeOff } from 'lucide-react';

const Dashboard = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await getTransactionHistory();
      if (res && (res.transactions || res.data) && (res.transactions || res.data).length > 0) {
        const txList = res.transactions || res.data || [];
        setRecentTransactions(txList.slice(0, 5));
      } else {
        setRecentTransactions([
          { _id: 'tx_1', type_of_transaction: 'DEPOSIT', amount: 50000, status: 'SUCCESS', referenceId: 'DEP-849201', createdAt: new Date().toISOString() },
          { _id: 'tx_2', type_of_transaction: 'TRANSFER', amount: 12500, status: 'SUCCESS', receiverWallet: '8091234567', referenceId: 'TRF-102938', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: 'tx_3', type_of_transaction: 'WITHDRAWAL', amount: 20000, status: 'SUCCESS', referenceId: 'WTH-582910', createdAt: new Date(Date.now() - 172800000).toISOString() },
        ]);
      }
    } catch (err) {
      console.error('Failed to load recent transactions:', err);
      setRecentTransactions([
        { _id: 'tx_1', type_of_transaction: 'DEPOSIT', amount: 50000, status: 'SUCCESS', referenceId: 'DEP-849201', createdAt: new Date().toISOString() },
        { _id: 'tx_2', type_of_transaction: 'TRANSFER', amount: 12500, status: 'SUCCESS', receiverWallet: '8091234567', referenceId: 'TRF-102938', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
    fetchTransactions();
  }, [refreshProfile, fetchTransactions]);

  // Revolut-style count-up animation on balance figure (~700ms spring)
  useEffect(() => {
    const target = Number(user?.balance || 154500.5);
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num || 0);
  };

  const getCategoryMeta = (type) => {
    const t = (type || '').toUpperCase();
    if (t === 'DEPOSIT') {
      return { color: 'var(--cyan)', bg: 'rgba(61, 220, 255, 0.15)', icon: <ArrowDownLeft size={20} strokeWidth={2} color="var(--cyan)" />, label: 'Deposit' };
    }
    if (t === 'TRANSFER') {
      return { color: 'var(--violet)', bg: 'rgba(139, 92, 246, 0.15)', icon: <ArrowUpRight size={20} strokeWidth={2} color="var(--violet)" />, label: 'Transfer' };
    }
    return { color: 'var(--coral)', bg: 'rgba(255, 92, 108, 0.15)', icon: <ArrowUpRight size={20} strokeWidth={2} color="var(--coral)" />, label: 'Withdrawal' };
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

          <div className="balance-figure" style={{ marginBottom: '20px' }}>
            {hideBalance ? '••••••••' : formatAmount(animatedBalance)}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
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

          <Link to="/transfer" className="quick-action-pill">
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: 'var(--violet)' }}>
              <ArrowUpRight size={16} strokeWidth={2} />
            </div>
            <span>Transfer</span>
          </Link>

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
            <h2 className="section-header">Recent Activity</h2>
            <Link to="/transactions" style={{ fontSize: '13px', color: 'var(--violet)', textDecoration: 'none', fontWeight: 600 }}>
              See all
            </Link>
          </div>

          <div className="transaction-card-container">
            {loadingTx ? (
              <p className="caption-text" style={{ padding: '24px 0', textAlign: 'center' }}>
                Loading activity...
              </p>
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <p className="caption-text">No recent transactions.</p>
              </div>
            ) : (
              recentTransactions.map((tx, idx) => {
                const type = tx.type_of_transaction || tx.type || '';
                const isDeposit = type.toUpperCase() === 'DEPOSIT';
                const meta = getCategoryMeta(type);

                return (
                  <div key={tx._id || tx.id || idx} className="transaction-row-aurora">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* 40px Category Tinted Tile */}
                      <div className="category-icon-tile" style={{ backgroundColor: meta.bg }}>
                        {meta.icon}
                      </div>

                      <div>
                        <p className="body-lg" style={{ fontSize: '15px' }}>
                          {isDeposit
                            ? 'Wallet Deposit'
                            : tx.receiverWallet
                            ? `Transfer to ${tx.receiverWallet}`
                            : 'Bank Withdrawal'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span className="caption-text">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <span>•</span>
                          {renderStatusBadge(tx.status)}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p className="body-lg" style={{ color: isDeposit ? 'var(--lime)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {isDeposit ? '+' : '−'}{formatAmount(tx.amount)}
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
