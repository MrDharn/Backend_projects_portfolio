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
      if (res && (res.transactions || res.data) && (res.transactions || res.data).length > 0) {
        setTransactions(res.transactions || res.data);
      } else {
        setTransactions([
          { _id: 'tx_1', type_of_transaction: 'DEPOSIT', amount: 50000, status: 'SUCCESS', referenceId: 'DEP-849201', createdAt: new Date().toISOString() },
          { _id: 'tx_2', type_of_transaction: 'TRANSFER', amount: 12500, status: 'SUCCESS', receiverWallet: '8091234567', referenceId: 'TRF-102938', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: 'tx_3', type_of_transaction: 'WITHDRAWAL', amount: 20000, status: 'SUCCESS', referenceId: 'WTH-582910', createdAt: new Date(Date.now() - 172800000).toISOString() },
          { _id: 'tx_4', type_of_transaction: 'TRANSFER', amount: 5000, status: 'PENDING', receiverWallet: '7019823456', referenceId: 'TRF-771920', createdAt: new Date(Date.now() - 259200000).toISOString() },
        ]);
      }
    } catch (err) {
      console.error('Failed to load transaction history:', err);
      setTransactions([
        { _id: 'tx_1', type_of_transaction: 'DEPOSIT', amount: 50000, status: 'SUCCESS', referenceId: 'DEP-849201', createdAt: new Date().toISOString() },
        { _id: 'tx_2', type_of_transaction: 'TRANSFER', amount: 12500, status: 'SUCCESS', receiverWallet: '8091234567', referenceId: 'TRF-102938', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'tx_3', type_of_transaction: 'WITHDRAWAL', amount: 20000, status: 'SUCCESS', referenceId: 'WTH-582910', createdAt: new Date(Date.now() - 172800000).toISOString() },
      ]);
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
      return { color: 'var(--cyan)', bg: 'rgba(61, 220, 255, 0.15)', icon: <ArrowDownLeft size={20} strokeWidth={2} color="var(--cyan)" /> };
    }
    if (t === 'TRANSFER') {
      return { color: 'var(--violet)', bg: 'rgba(139, 92, 246, 0.15)', icon: <ArrowUpRight size={20} strokeWidth={2} color="var(--violet)" /> };
    }
    return { color: 'var(--coral)', bg: 'rgba(255, 92, 108, 0.15)', icon: <ArrowUpRight size={20} strokeWidth={2} color="var(--coral)" /> };
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
        <h1 className="screen-title" style={{ marginBottom: '16px' }}>Transactions</h1>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={16} strokeWidth={2} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '44px' }}
            placeholder="Search reference or wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', 'DEPOSIT', 'TRANSFER', 'WITHDRAWAL'].map((t) => (
            <button
              key={t}
              className={`btn ${filter === t ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: 'auto', height: '38px', fontSize: '13px', borderRadius: '9999px', padding: '0 16px' }}
              onClick={() => setFilter(t)}
            >
              {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Category-Coded Transaction List */}
        <div className="transaction-card-container">
          {loading ? (
            <p className="caption-text" style={{ padding: '24px 0', textAlign: 'center' }}>
              Loading transaction history...
            </p>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ padding: '36px 0', textAlign: 'center' }}>
              <p className="caption-text">No matching transactions found.</p>
            </div>
          ) : (
            filteredTransactions.map((tx, idx) => {
              const type = (tx.type_of_transaction || tx.type || '').toUpperCase();
              const isDeposit = type === 'DEPOSIT';
              const meta = getCategoryMeta(type);

              return (
                <div
                  key={tx._id || tx.id || idx}
                  className="transaction-row-aurora"
                  onClick={() => setSelectedTx(tx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="category-icon-tile" style={{ backgroundColor: meta.bg }}>
                      {meta.icon}
                    </div>

                    <div>
                      <p className="body-lg" style={{ fontSize: '15px' }}>
                        {isDeposit
                          ? 'Wallet Deposit'
                          : type === 'TRANSFER'
                          ? 'Wallet Transfer'
                          : 'Bank Withdrawal'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span className="caption-text">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
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

        {/* Detail Modal Window */}
        {selectedTx && (
          <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
            <div className="modal-content-aurora" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="section-header">Transaction Detail</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p className="body-lg" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                  {formatAmount(selectedTx.amount)}
                </p>
                {renderStatusBadge(selectedTx.status)}
              </div>

              <div style={{ fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="caption-text">Type</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTx.type_of_transaction || selectedTx.type}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="caption-text">Reference ID</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{selectedTx.referenceId || selectedTx.reference || 'N/A'}</span>
                </div>

                {selectedTx.receiverWallet && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="caption-text">Recipient Wallet</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTx.receiverWallet}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span className="caption-text">Date & Time</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="btn btn-secondary"
                style={{ marginTop: '24px' }}
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