import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ArrowDownLeft, ArrowUpRight, History, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="floating-bottom-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? 'nav-item-aurora active' : 'nav-item-aurora')}
      >
        <div className="nav-icon-bg">
          <Home size={18} strokeWidth={2} />
        </div>
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/deposit"
        className={({ isActive }) => (isActive ? 'nav-item-aurora active' : 'nav-item-aurora')}
      >
        <div className="nav-icon-bg">
          <ArrowDownLeft size={18} strokeWidth={2} />
        </div>
        <span>Deposit</span>
      </NavLink>

      <NavLink
        to="/transfer"
        className={({ isActive }) => (isActive ? 'nav-item-aurora active' : 'nav-item-aurora')}
      >
        <div className="nav-icon-bg">
          <ArrowUpRight size={18} strokeWidth={2} />
        </div>
        <span>Transfer</span>
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) => (isActive ? 'nav-item-aurora active' : 'nav-item-aurora')}
      >
        <div className="nav-icon-bg">
          <History size={18} strokeWidth={2} />
        </div>
        <span>Ledger</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? 'nav-item-aurora active' : 'nav-item-aurora')}
      >
        <div className="nav-icon-bg">
          <User size={18} strokeWidth={2} />
        </div>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
