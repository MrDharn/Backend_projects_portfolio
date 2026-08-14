import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ChevronRight, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const isPinSet = user?.isPinSet !== false;

  return (
    <>
      <Navbar />

      <main className="app-container">
        {/* User Card */}
        <section className="card" style={{ padding: '24px 20px', marginBottom: '20px' }}>
          <h2 className="section-header" style={{ fontSize: '22px' }}>{user?.name || 'Wallet User'}</h2>
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
              <span className="badge-pill-success">{user?.KYC_STATUS || 'Active'}</span>
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
                justifyContent: 'space-between',
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
                justifyContent: 'space-between',
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

        <button
          onClick={() => setShowLogoutModal(true)}
          className="btn btn-secondary"
          style={{ color: 'var(--coral)', marginTop: '8px' }}
        >
          <LogOut size={18} strokeWidth={2} /> Sign Out of Wallet
        </button>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
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
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              className="card"
              style={{ width: '100%', maxWidth: '380px', padding: '24px', textAlign: 'center', animation: 'modalPop 300ms var(--ease-spring)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(255, 92, 108, 0.15)',
                  color: 'var(--coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <LogOut size={26} strokeWidth={2} />
              </div>
              <h3 className="section-header" style={{ marginBottom: '8px' }}>Sign Out Confirmation</h3>
              <p className="caption-text" style={{ marginBottom: '24px' }}>
                Are you sure you want to end your current wallet session?
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="btn"
                  style={{ flex: 1, backgroundColor: 'var(--coral)', color: '#fff' }}
                >
                  Sign Out
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

export default Profile;