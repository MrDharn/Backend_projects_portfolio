import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTransactionHistory } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { Search, X, ArrowDownLeft, ArrowUpRight, Send, Building, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTransactionHistory();
      const list = res?.transactions || res?.data?.transactions || res?.data || (Array.isArray(res) ? res : []);
      setTransactions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load transaction history:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const type = (tx.type_of_transaction || tx.type || '').toUpperCase();
      if (filter !== 'ALL') {
        if (filter === 'DEPOSIT' && type !== 'DEPOSIT' && type !== 'CREDIT') return false;
        if (filter === 'TRANSFER' && type !== 'TRANSFER') return false;
        if (filter === 'WITHDRAWAL' && type !== 'WITHDRAWAL' && type !== 'DEBIT') return false;
      }

      if (searchTerm) {
        const ref = (tx.referenceId || tx.reference || '').toLowerCase();
        const wallet = (tx.receiverWallet || tx.senderWallet || '').toLowerCase();
        const bank = (tx.bankName || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return ref.includes(term) || wallet.includes(term) || bank.includes(term);
      }

      return true;
    });
  }, [transactions, filter, searchTerm]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="screen-title">Activity Ledger</h1>
          <span className="badge-pill-pending" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            {filteredTransactions.length} records
          </span>
        </div>

        {/* Filter Segmented Control Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'ALL', label: 'All Activity' },
            { key: 'DEPOSIT', label: 'Deposits' },
            { key: 'TRANSFER', label: 'Transfers' },
            { key: 'WITHDRAWAL', label: 'Withdrawals' },
          ].map((cat) => (
            <button
              key={cat.key}
              className="btn"
              style={{
                height: '38px',
                fontSize: '12px',
                borderRadius: 'var(--radius-pill)',
                padding: '0 16px',
                whiteSpace: 'nowrap',
                background: filter === cat.key ? 'var(--gradient-button)' : 'var(--surface-1)',
                color: filter === cat.key ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
              onClick={() => setFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={18} strokeWidth={2} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '46px' }}
            placeholder="Search by reference, wallet, or bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Transaction Items */}
        <div className="transaction-card-container">
          {loading ? (
            <p className="caption-text" style={{ padding: '32px 0', textAlign: 'center' }}>
              Loading ledger transactions...
            </p>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
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
                <FileText size={24} strokeWidth={2} />
              </div>
              <h3 className="body-lg" style={{ marginBottom: '6px', fontWeight: 700 }}>No Transactions Found</h3>
              <p className="caption-text">
                {searchTerm || filter !== 'ALL' ? 'No transactions match your filter criteria.' : 'Your wallet activity will appear here.'}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx, idx) => {
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

        {/* Digital Receipt Modal */}
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
                <span className="font-label">TRANSACTION DETAILS</span>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0', borderBottom: '1px dashed var(--border)', fontSize: '14px' }}>
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

                {selectedTx.bankName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption-text">Bank Name</span>
                    <span style={{ fontWeight: 600 }}>{selectedTx.bankName}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const ref = selectedTx.referenceId || selectedTx.reference;
                    if (ref) {
                      navigator.clipboard.writeText(ref);
                      toast.success('Transaction reference copied to clipboard!');
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <Copy size={16} strokeWidth={2} /> Copy Ref
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
};

export default Transactions;