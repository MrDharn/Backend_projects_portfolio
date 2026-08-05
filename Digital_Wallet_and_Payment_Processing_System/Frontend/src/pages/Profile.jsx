import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ChevronRight, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isPinSet = user?.isPinSet !== false;

  return (
    <>
      <Navbar />

      <main className="app-container">
        {/* User Card */}
        <section className="card" style={{ padding: '24px 20px', marginBottom: '20px' }}>
          <h2 className="section-header" style={{ fontSize: '22px' }}>{user?.name || 'Account User'}</h2>
          <p className="caption-text" style={{ marginTop: '2px' }}>{user?.email || 'N/A'}</p>
        </section>

        {/* Account Info */}
        <section className="card">
          <span className="font-label" style={{ marginBottom: '14px' }}>
            ACCOUNT DETAILS
          </span>

          <div style={{ fontSize: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="caption-text">Wallet Account No.</span>
              <span className="body-text" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{user?.walletNumber || '—'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="caption-text">Phone Number</span>
              <span className="body-text" style={{ fontWeight: 500 }}>{user?.phoneNumber || user?.phone || '—'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span className="caption-text">KYC Verification</span>
              <span className="badge-pill-success">Verified</span>
            </div>
          </div>
        </section>

        {/* Security Links */}
        <section className="card">
          <span className="font-label" style={{ marginBottom: '14px' }}>
            SECURITY & AUTHENTICATION
          </span>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link
              to={isPinSet ? '/change-pin' : '/set-pin'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <div>
                <p className="body-lg" style={{ fontSize: '15px' }}>
                  {isPinSet ? 'Change Transaction PIN' : 'Set Transaction PIN'}
                </p>
                <div style={{ marginTop: '2px' }}>
                  <span className={isPinSet ? 'badge-pill-success' : 'badge-pill-pending'} style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {isPinSet ? '4-digit PIN active' : 'PIN not configured'}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} strokeWidth={2} color="var(--text-secondary)" />
            </Link>

            <Link
              to="/change-password"
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '14px 0',
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <div>
                <p className="body-lg" style={{ fontSize: '15px' }}>Change Password</p>
                <span className="caption-text" style={{ marginTop: '2px', display: 'block' }}>
                  Update primary account password
                </span>
              </div>
              <ChevronRight size={18} strokeWidth={2} color="var(--text-secondary)" />
            </Link>
          </div>
        </section>

        <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--coral)', marginTop: '8px' }}>
          <LogOut size={18} strokeWidth={2} /> Sign Out of Wallet
        </button>
      </main>

      <BottomNav />
    </>
  );
};

export default Profile;