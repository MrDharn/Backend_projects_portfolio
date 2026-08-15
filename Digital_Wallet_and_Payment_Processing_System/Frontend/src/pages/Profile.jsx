import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { ChevronRight, LogOut, ShieldCheck, KeyRound, Lock, User, Check, Copy } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    toast.info('Session ended. Logged out successfully');
    navigate('/login');
  };

  const handleCopyWalletNumber = () => {
    if (user?.walletNumber) {
      navigator.clipboard.writeText(String(user.walletNumber));
      setCopied(true);
      toast.success('Wallet account number copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPinSet = user?.isPinSet !== false;

  return (
    <>
      <Navbar />

      <main className="app-container">
        {/* User Identity Card */}
        <section className="card" style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--gradient-button)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'PayPulse Member'}
              </h2>
              <span className="badge-pill-success" style={{ fontSize: '10px', padding: '2px 8px' }}>Active</span>
            </div>
            <p className="caption-text" style={{ marginTop: '2px', fontSize: '13px' }}>{user?.email || 'N/A'}</p>
          </div>
        </section>

        {/* Security Health Meter */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(0, 245, 155, 0.12) 0%, rgba(0, 210, 255, 0.06) 100%)',
            border: '1px solid rgba(0, 245, 155, 0.25)',
            borderRadius: 'var(--radius-card)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(0, 245, 155, 0.2)',
              color: 'var(--mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>

          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Security Health: 100% Protected
            </p>
            <span className="caption-text" style={{ fontSize: '12px', color: 'var(--mint)' }}>
              Tier 1 KYC Verified • 4-Digit PIN Configured
            </span>
          </div>
        </section>

        {/* Account Details & Limits */}
        <section className="card">
          <span className="font-label" style={{ marginBottom: '14px', display: 'block' }}>
            ACCOUNT & LIMITS
          </span>

          <div style={{ fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="caption-text">Wallet Account No.</span>
              <button
                onClick={handleCopyWalletNumber}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
              >
                <span>{user?.walletNumber || '—'}</span>
                {copied ? <Check size={14} color="var(--mint)" /> : <Copy size={14} color="var(--text-secondary)" />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="caption-text">Phone Number</span>
              <span style={{ fontWeight: 600 }}>{user?.phoneNumber || user?.phone || '—'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="caption-text">KYC Verification</span>
              <span className="badge-pill-success">{user?.KYC_STATUS || 'Tier 1 Verified'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span className="caption-text">Daily Transfer Limit</span>
              <span style={{ fontWeight: 700, color: 'var(--mint)' }}>₦5,000,000.00</span>
            </div>
          </div>
        </section>

        {/* Security & Authentication Navigation */}
        <section className="card">
          <span className="font-label" style={{ marginBottom: '14px', display: 'block' }}>
            SECURITY SETTINGS
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet)' }}>
                  <KeyRound size={18} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>
                    {isPinSet ? 'Change Transaction PIN' : 'Set Transaction PIN'}
                  </p>
                  <span className="caption-text" style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}>
                    {isPinSet ? '4-digit authorization PIN active' : 'PIN required for transfers'}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                  <Lock size={18} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>Change Password</p>
                  <span className="caption-text" style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}>
                    Update your primary account login credentials
                  </span>
                </div>
              </div>
              <ChevronRight size={18} strokeWidth={2} color="var(--text-secondary)" />
            </Link>
          </div>
        </section>

        {/* Sign Out Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="btn btn-secondary"
          style={{ color: 'var(--coral)', borderColor: 'rgba(255, 75, 110, 0.3)', marginTop: '4px' }}
        >
          <LogOut size={18} strokeWidth={2} /> End Wallet Session
        </button>

        {/* High-Trust Logout Confirmation Modal */}
        {showLogoutModal && (
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
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              className="card"
              style={{ width: '100%', maxWidth: '380px', padding: '24px', textAlign: 'center', animation: 'modalPop 300ms var(--ease-spring)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(255, 75, 110, 0.15)',
                  color: 'var(--coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <LogOut size={26} strokeWidth={2.2} />
              </div>
              <h3 className="section-header" style={{ marginBottom: '8px' }}>Sign Out Confirmation</h3>
              <p className="caption-text" style={{ marginBottom: '24px' }}>
                Are you sure you want to end your current session? You will need your password to log in again.
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
                  style={{ flex: 1, backgroundColor: 'var(--coral)', color: '#FFFFFF' }}
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