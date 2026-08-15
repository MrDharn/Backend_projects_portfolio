import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'PayPulse';
      case '/deposit':
        return 'Deposit Funds';
      case '/transfer':
        return 'Send Money';
      case '/transactions':
        return 'Activity Ledger';
      case '/profile':
        return 'Account & Security';
      case '/change-password':
        return 'Change Password';
      case '/set-pin':
        return 'Set Transaction PIN';
      case '/change-pin':
        return 'Change PIN';
      default:
        return 'PayPulse';
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="aurora-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isDashboard ? (
          <button
            onClick={handleBack}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              transition: 'all 160ms var(--ease-smooth)',
              flexShrink: 0,
            }}
            title="Go back"
          >
            <ArrowLeft size={18} strokeWidth={2.4} />
          </button>
        ) : (
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              padding: '5px',
              flexShrink: 0,
            }}
            title="PayPulse Home"
          >
            <img
              src="/favicon.svg"
              alt="PayPulse Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Link>
        )}

        <h1 className="screen-title" style={{ fontSize: isDashboard ? '20px' : '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: User Profile Avatar badge (links directly to profile) */}
      {user && (
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            padding: '5px 12px 5px 6px',
            borderRadius: 'var(--radius-pill)',
            transition: 'all 160ms var(--ease-smooth)',
          }}
          title="View Profile & Security"
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--gradient-button)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {user.name ? user.name.split(' ')[0] : 'Account'}
          </span>
        </Link>
      )}
    </header>
  );
};

export default Navbar;
