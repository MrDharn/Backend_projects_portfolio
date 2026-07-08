import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./css/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="sidebar">
      <h2>WalletApp</h2>

      <NavLink to="/dashboard">
        <FaHome />
        Dashboard
      </NavLink>

      <NavLink to="/wallet">
        <FaWallet />
        Wallet
      </NavLink>

      <NavLink to="/transfer">
        <FaExchangeAlt />
        Transfer
      </NavLink>

      <NavLink to="/transactions">
        <FaHistory />
        Transactions
      </NavLink>

      <NavLink to="/profile">
        <FaUser />
        Profile
      </NavLink>

      <NavLink to="/settings">
        <FaCog />
        Settings
      </NavLink>

      <button onClick={logout}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
