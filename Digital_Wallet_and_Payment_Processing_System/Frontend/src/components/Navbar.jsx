import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="aurora-header">
      <h1 className="screen-title" style={{ fontSize: '22px' }}>{getPageTitle()}</h1>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {user.name}
          </span>
          <button
            onClick={handleLogout}
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
              color: 'var(--text-primary)',
            }}
            title="Sign out"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
