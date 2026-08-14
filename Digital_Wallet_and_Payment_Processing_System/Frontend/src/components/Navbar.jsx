import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'PayPulse';
      case '/deposit':
        return 'Deposit';
      case '/transfer':
        return 'Transfer';
      case '/transactions':
        return 'Transactions';
      case '/profile':
        return 'Profile';
      case '/change-password':
        return 'Security';
      case '/set-pin':
        return 'PIN Setup';
      case '/change-pin':
        return 'PIN Setup';
      default:
        return 'PayPulse';
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <header className="aurora-header">
        <h1 className="screen-title" style={{ fontSize: '22px' }}>{getPageTitle()}</h1>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {user.name}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              style={{
                background: 'var(--surface-2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--coral)',
              }}
              title="Sign out"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        )}
      </header>

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
    </>
  );
};

export default Navbar;
