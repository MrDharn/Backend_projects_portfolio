import React from "react";
import "./css/dashboard.css";
import DashboardLayout from "../layout/DashboardLayout";
const Dashboard = () => {
  return (
    <DashboardLayout>
    
         <div className="dashboard-grid">

        <div className="card">

          <h3>Wallet Balance</h3>

          <h2>₦0.00</h2>

        </div>

        <div className="card">

          <h3>Wallet Number</h3>

          <h2>----------</h2>

        </div>

        <div className="card">

          <h3>Transactions</h3>

          <h2>0</h2>

        </div>

        <div className="card">

          <h3>Status</h3>

          <h2>Active</h2>

        </div>
      </div>
      <p>Welcome to your Wallet Application.</p>
    </DashboardLayout>
  );
};

export default Dashboard;
