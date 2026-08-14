import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ArrowDownLeft, ArrowUpRight, History, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <Home size={19} strokeWidth={2.2} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/deposit"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <ArrowDownLeft size={19} strokeWidth={2.2} />
        <span>Deposit</span>
      </NavLink>

      <NavLink
        to="/transfer"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <ArrowUpRight size={19} strokeWidth={2.2} />
        <span>Transfer</span>
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <History size={19} strokeWidth={2.2} />
        <span>Ledger</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <User size={19} strokeWidth={2.2} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
