import React from "react";
import RecentSales from "./RecentSales";
import LowStock from "./LowStock";
import StatCard from "../../components/ui/StatCard";
import DashboardHeader from "./DashboardHeader";

import {
  FaBoxes,
  FaMoneyBillWave,
  FaShoppingCart,
  FaExclamationTriangle,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <>
        <DashboardHeader /> 
         <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          value="352"
          icon={FaBoxes}
          color="#2563EB"
        />

        <StatCard
          title="Revenue"
          value="₦3,250,000"
          icon={FaMoneyBillWave}
          color="#22C55E"
        />

         <StatCard
          title="Sales"
          value="148"
          icon={FaShoppingCart}
          color="#F59E0B"
        />

         <StatCard
          title="Low Stock"
          value="12"
          icon={FaExclamationTriangle}
          color="#EF4444"
        />
      </div>

       <div className="grid gap-6 lg:grid-cols-2">
        <RecentSales />
        <LowStock />
      </div>
    </>
  );
};

export default Dashboard;
