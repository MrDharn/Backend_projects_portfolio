import React from "react";
import "./css/navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <h3>Dashboard</h3>
      </div>

      <div className="user-box">
        <div className="avatar">D</div>

        <div>
          <h4>Welcome Back</h4>

          <p>Wallet User</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
