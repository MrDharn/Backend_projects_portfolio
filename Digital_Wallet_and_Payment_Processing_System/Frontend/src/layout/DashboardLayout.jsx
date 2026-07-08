import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import './dashboardLayout.css'
const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
