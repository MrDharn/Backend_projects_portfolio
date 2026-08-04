import {React, useContext} from "react";
import "./css/dashboard.css";
import DashboardLayout from "../layout/DashboardLayout";
import {AuthContext} from "../context/AuthContext"

const Dashboard = () => {
  const {user} = useContext(AuthContext)

  return (
    <DashboardLayout>
    
         <div className="dashboard-grid">

        <div className="card">

          <h3>Wallet Balance</h3>

          <h2>₦{user.balance}</h2>

        </div>

        <div className="card">

          <h3>
            Wallet Number
          </h3>
            <span>{user.walletNumber}</span>

          <h2></h2>

        </div>

        <div className="card">

          <h3>Transactions</h3>

          <h2>{user.transactions}</h2>

        </div>

        <div className="card">

          <h3>KYC Status</h3>

          <h2>{user.KYC_STATUS}</h2>

        </div>
      </div>
      <p>Welcome to your Wallet Application.</p>
    </DashboardLayout>
  );
};

export default Dashboard;
