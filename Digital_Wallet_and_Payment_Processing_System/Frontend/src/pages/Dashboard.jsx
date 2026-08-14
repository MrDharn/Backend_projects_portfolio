import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { getTransactionHistory } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  X,
  CreditCard,
  Building,
  Send,
  ExternalLink,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useContext(AuthContext);

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [selectedTx, setSelectedTx] = useState(null);

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

  // Spring count-up balance animation
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

  // Compute live Inflow vs Outflow analytics from transactions
  const financialFlow = useMemo(() => {
    let inflow = 0;
    let outflow = 0;

    recentTransactions.forEach((tx) => {
      const type = (tx.type_of_transaction || tx.type || '').toUpperCase();
      const amount = Number(tx.amount) || 0;
      const status = (tx.status || '').toUpperCase();

      if (status === 'SUCCESS' || status === 'SUCCESSFUL' || status === 'COMPLETED') {
        if (type === 'DEPOSIT' || type === 'CREDIT') {
          inflow += amount;
        } else {
          outflow += amount;
        }
      }
    });

    return { inflow, outflow };
  }, [recentTransactions]);

  const handleCopyWalletNumber = () => {
    if (user?.walletNumber) {
      navigator.clipboard.writeText(String(user.walletNumber));
      setCopied(true);
      toast.success('Wallet account number copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    toast.info('Syncing wallet ledger...');
    await refreshProfile();
    await fetchTransactions();
    toast.success('Wallet sync complete');
  };

  const formatAmount = (num) => {
    const parsed = Number(num) || 0;
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(parsed);
  };

  const getCategoryMeta = (type) => {
    const t = (type || '').toUpperCase();
    if (t === 'DEPOSIT' || t === 'CREDIT') {
      return {
        color: 'var(--mint)',
        bg: 'rgba(0, 245, 155, 0.15)',
        icon: <ArrowDownLeft size={20} strokeWidth={2.2} color="var(--mint)" />,
        label: 'Deposit',
        isPositive: true,
      };
    }
    if (t === 'TRANSFER') {
      return {
        color: 'var(--violet)',
        bg: 'rgba(139, 92, 246, 0.15)',
        icon: <Send size={18} strokeWidth={2.2} color="var(--violet)" />,
        label: 'Transfer',
        isPositive: false,
      };
    }
    return {
      color: 'var(--coral)',
      bg: 'rgba(255, 75, 110, 0.15)',
      icon: <Building size={18} strokeWidth={2.2} color="var(--coral)" />,
      label: 'Withdrawal',
      isPositive: false,
    };
  };

  const getTransactionTitle = (tx) => {
    const type = (tx.type_of_transaction || tx.type || '').toUpperCase();
    if (type === 'DEPOSIT' || type === 'CREDIT') return 'Wallet Deposit';
    if (type === 'TRANSFER') {
      return tx.receiverWallet ? `Transfer to ${tx.receiverWallet}` : 'Wallet-to-Wallet Transfer';
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
        {/* Revolut Signature Aurora Balance Hero Card */}
        <section className="aurora-hero-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="font-label" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
              TOTAL WALLET BALANCE
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleRefresh}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Sync balance"
              >
                <RefreshCw size={14} strokeWidth={2.2} />
              </button>

              <button
                onClick={() => setHideBalance(!hideBalance)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={hideBalance ? 'Show balance' : 'Hide balance'}
              >
                {hideBalance ? <EyeOff size={16} strokeWidth={2.2} /> : <Eye size={16} strokeWidth={2.2} />}
              </button>
            </div>
          </div>

          <div className="balance-figure" style={{ marginBottom: '22px' }}>
            {hideBalance ? '••••••••' : formatAmount(animatedBalance)}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                WALLET ACCOUNT NO.
              </span>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', letterSpacing: '0.02em' }}>
                {user?.walletNumber || '—'}
              </p>
            </div>

            <button
              onClick={handleCopyWalletNumber}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
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
              {copied ? <Check size={15} strokeWidth={2.5} color="var(--mint)" /> : <Copy size={15} strokeWidth={2.2} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </section>

        {/* Live Monthly Flow Analytics KPI Cards */}
        <section className="flow-kpi-grid">
          <div className="flow-kpi-card">
            <div className="flow-kpi-header">
              <TrendingUp size={14} color="var(--mint)" />
              <span>TOTAL INFLOW</span>
            </div>
            <p className="flow-kpi-value" style={{ color: 'var(--mint)' }}>
              +{formatAmount(financialFlow.inflow)}
            </p>
          </div>

          <div className="flow-kpi-card">
            <div className="flow-kpi-header">
              <TrendingDown size={14} color="var(--coral)" />
              <span>TOTAL OUTFLOW</span>
            </div>
            <p className="flow-kpi-value" style={{ color: 'var(--coral)' }}>
              −{formatAmount(financialFlow.outflow)}
            </p>
          </div>
        </section>

        {/* Tactile 4-Pillar Quick Actions Grid */}
        <section className="quick-actions-row">
          <Link to="/deposit" className="quick-action-pill">
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(0, 210, 255, 0.15)', color: 'var(--cyan)' }}>
              <ArrowDownLeft size={20} strokeWidth={2.2} />
            </div>
            <span>Deposit</span>
          </Link>

          <button
            onClick={() => {
              if (user && user.isPinSet === false) {
                toast.info('Please configure your 4-digit transaction PIN before transferring.');
                navigate('/set-pin', { state: { from: '/transfer' } });
              } else {
                navigate('/transfer');
              }
            }}
            className="quick-action-pill"
          >
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: 'var(--violet)' }}>
              <ArrowUpRight size={20} strokeWidth={2.2} />
            </div>
            <span>Transfer</span>
          </button>

          <Link to="/transactions" className="quick-action-pill">
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>
              <History size={20} strokeWidth={2.2} />
            </div>
            <span>History</span>
          </Link>

          <Link to="/profile" className="quick-action-pill">
            <div className="action-tile-icon" style={{ backgroundColor: 'rgba(0, 245, 155, 0.15)', color: 'var(--mint)' }}>
              <ShieldCheck size={20} strokeWidth={2.2} />
            </div>
            <span>Security</span>
          </Link>
        </section>

        {/* Dynamic Recent Activity Ledger */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 className="section-header">Recent Transactions</h2>
            {recentTransactions.length > 0 && (
              <Link to="/transactions" style={{ fontSize: '13px', color: 'var(--violet)', textDecoration: 'none', fontWeight: 600 }}>
                View All ({recentTransactions.length})
              </Link>
            )}
          </div>

          <div className="transaction-card-container">
            {loadingTx ? (
              <p className="caption-text" style={{ padding: '28px 0', textAlign: 'center' }}>
                Syncing activity ledger...
              </p>
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px auto',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <CreditCard size={24} strokeWidth={2} />
                </div>
                <h3 className="body-lg" style={{ marginBottom: '6px', fontWeight: 700 }}>No Transactions Yet</h3>
                <p className="caption-text" style={{ marginBottom: '18px' }}>
                  Fund your wallet via Paystack to start making seamless payments.
                </p>
                <Link to="/deposit" className="btn btn-primary" style={{ height: '42px', width: 'auto', padding: '0 24px', display: 'inline-flex', textDecoration: 'none' }}>
                  Make First Deposit
                </Link>
              </div>
            ) : (
              recentTransactions.slice(0, 6).map((tx, idx) => {
                const type = tx.type_of_transaction || tx.type || '';
                const meta = getCategoryMeta(type);
                const title = getTransactionTitle(tx);

                return (
                  <div
                    key={tx._id || tx.id || tx.referenceId || idx}
                    className="transaction-row-aurora"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="category-icon-tile" style={{ backgroundColor: meta.bg }}>
                        {meta.icon}
                      </div>

                      <div>
                        <p className="body-lg" style={{ fontSize: '15px', fontWeight: 600 }}>
                          {title}
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
                      <p className="body-lg" style={{ color: meta.isPositive ? 'var(--mint)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                        {meta.isPositive ? '+' : '−'}{formatAmount(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Digital Receipt Card Modal */}
        {selectedTx && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.8)',
              backdropFilter: 'blur(16px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSelectedTx(null)}
          >
            <div
              className="receipt-card"
              style={{ width: '100%', maxWidth: '420px', animation: 'modalPop 300ms var(--ease-spring)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="font-label">OFFICIAL TRANSACTION RECEIPT</span>
                <button
                  onClick={() => setSelectedTx(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={20} strokeWidth={2.2} />
                </button>
              </div>

              <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px dashed var(--border)' }}>
                <p className="caption-text" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {getTransactionTitle(selectedTx)}
                </p>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                  {formatAmount(selectedTx.amount)}
                </h3>
                <div style={{ marginTop: '8px' }}>
                  {renderStatusBadge(selectedTx.status)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption-text">Reference ID</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                    {selectedTx.referenceId || selectedTx.reference || 'N/A'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption-text">Date & Time</span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>

                {selectedTx.receiverWallet && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption-text">Recipient Wallet</span>
                    <span style={{ fontWeight: 600 }}>{selectedTx.receiverWallet}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const ref = selectedTx.referenceId || selectedTx.reference;
                  if (ref) {
                    navigator.clipboard.writeText(ref);
                    toast.success('Transaction reference copied to clipboard!');
                  }
                }}
                className="btn btn-secondary"
                style={{ marginTop: '8px' }}
              >
                <Copy size={16} strokeWidth={2} /> Copy Reference ID
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
};

export default Dashboard;
