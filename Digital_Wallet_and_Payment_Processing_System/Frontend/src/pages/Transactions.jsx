import React, { useState, useEffect, useCallback } from 'react';
import { getTransactionHistory } from '../services/apiClient';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { Search, X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

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
      const list = res?.transactions || res?.data || (Array.isArray(res) ? res : []);
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

  const filteredTransactions = transactions.filter((tx) => {
    const type = (tx.type_of_transaction || tx.type || '').toUpperCase();
    if (filter !== 'ALL' && type !== filter) {
      return false;
    }

    if (searchTerm) {
      const ref = (tx.referenceId || tx.reference || '').toLowerCase();
      const wallet = (tx.receiverWallet || tx.senderWallet || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return ref.includes(term) || wallet.includes(term);
    }

    return true;
  });

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
        <h1 className="screen-title" style={{ marginBottom: '16px' }}>Transaction History</h1>

        {/* Filter Segmented Control Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', 'DEPOSIT', 'TRANSFER', 'WITHDRAWAL'].map((category) => (
            <button
              key={category}
              className={`btn ${filter === category ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                height: '36px',
                fontSize: '12px',
                borderRadius: '9999px',
                padding: '0 14px',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setFilter(category)}
            >
              {category === 'ALL' ? 'All Activity' : category.toLowerCase() + 's'}
            </button>
          ))}
        </div>

        {/* Search Input Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={16} strokeWidth={2} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '44px' }}
            placeholder="Search by reference or wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Transaction Items */}
        <div className="transaction-card-container">
          {loading ? (
            <p className="caption-text" style={{ padding: '24px 0', textAlign: 'center' }}>
              Loading transactions...
            </p>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p className="body-lg" style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>No transactions found</p>
              <p className="caption-text">
                {searchTerm || filter !== 'ALL' ? 'Try adjusting your filters or search term.' : 'Your transaction history will appear here.'}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx, idx) => {
              const type = tx.type_of_transaction || tx.type || '';
              const isDeposit = type.toUpperCase() === 'DEPOSIT';
              const meta = getCategoryMeta(type);

              return (
                <div
                  key={tx._id || tx.id || idx}
                  className="transaction-row-aurora"
                  onClick={() => setSelectedTx(tx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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

        {/* Transaction Detail Modal */}
        {selectedTx && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSelectedTx(null)}
          >
            <div
              className="card"
              style={{ width: '100%', maxWidth: '420px', padding: '24px', animation: 'modalPop 300ms var(--ease-spring)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-header">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span className="caption-text">Amount</span>
                  <span className="body-lg" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {formatAmount(selectedTx.amount)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span className="caption-text">Type</span>
                  <span className="body-text" style={{ textTransform: 'capitalize' }}>
                    {(selectedTx.type_of_transaction || selectedTx.type || 'Transaction').toLowerCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span className="caption-text">Status</span>
                  <span>{renderStatusBadge(selectedTx.status)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span className="caption-text">Reference</span>
                  <span className="body-text" style={{ fontVariantNumeric: 'tabular-nums', fontSize: '12px', wordBreak: 'break-all' }}>
                    {selectedTx.referenceId || selectedTx.reference || 'N/A'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption-text">Date & Time</span>
                  <span className="body-text">
                    {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="btn btn-secondary"
                style={{ marginTop: '20px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
};

export default Transactions;